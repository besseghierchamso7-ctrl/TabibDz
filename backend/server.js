const express = require('express');
const path = require('path');
const cors = require('cors');
const dns = require('dns');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const teleconsultationRoutes = require('./routes/teleconsultationRoutes');
const queueRoutes = require('./routes/queueRoutes');
const waitingListRoutes = require('./routes/waitingListRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const specialtyRoutes = require('./routes/specialtyRoutes');
const wilayaRoutes = require('./routes/wilayaRoutes');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const socketService = require('./services/socketService');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dns.setServers(['1.1.1.1', '8.8.8.8']);
console.log('Using DNS servers:', dns.getServers());

connectDB();

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');
const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = new Set([
  normalizeOrigin(process.env.CLIENT_URL),
  'https://tabib-dz-gamma.vercel.app',
  ...localOrigins
].filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(xssClean());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimiter);
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.get('/', (req, res) => {
  res.send('Tabib DZ API is running');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Tabib DZ API is running' });
});

app.get('/api/stats/public', async (req, res, next) => {
  try {
    const User = require('./models/User');
    const Doctor = require('./models/Doctor');
    const Appointment = require('./models/Appointment');

    const [patientCount, doctorCount, appointmentCount] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments({ status: 'verified' }),
      Appointment.countDocuments({ status: 'confirmed' })
    ]);

    res.json({
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/teleconsultations', teleconsultationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/waiting-list', waitingListRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/wilayas', wilayaRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

// Initialize Socket.io with CORS matching allowed origins
const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins],
    methods: ['GET','POST']
  }
});

socketService.setIO(io);

io.on('connection', (socket) => {
  // Authenticate socket if token provided
  (async () => {
    try {
      const token = socket.handshake?.auth?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usr = await User.findById(decoded.id).select('-password');
        if (usr) {
          socket.user = usr;
          // auto-join user-specific room
          if (usr.role === 'patient') socket.join(`patient_${usr._id}`);
          if (usr.role === 'doctor') socket.join(`doctor_${usr._id}`);
        }
      }
    } catch (e) {
      // ignore auth failure for anonymous sockets
    }
  })();

  console.log('Socket connected:', socket.id);
  socket.on('joinRoom', (room) => {
    // Only allow joining public rooms or if authenticated
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`${socket.id} left ${room}`);
  });
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
