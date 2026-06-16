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
const { sendSuccess, sendError } = require('./utils/response');
const { HTTP_STATUS } = require('./utils/constants');

// Import routes
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

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
const jwtExpiry = process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE;
if (!jwtExpiry) {
  missingEnvVars.push('JWT_EXPIRES_IN or JWT_EXPIRE');
}

if (missingEnvVars.length > 0) {
  console.error(`✗ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const socketService = require('./services/socketService');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dns.setServers(['1.1.1.1', '8.8.8.8']);
console.log('✓ DNS servers configured:', dns.getServers());

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

// Enhanced Helmet security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' },
}));

app.use(xssClean());
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key "${key}" in request`);
  },
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(rateLimiter);

// Morgan logging with custom format for production
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Health check endpoints
app.get('/health', (req, res) => {
  return sendSuccess(res, { 
    status: 'healthy',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }, 'Server is healthy');
});

app.get('/', (req, res) => {
  return sendSuccess(res, { 
    api: 'Tabib DZ Medical Appointment Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }, 'Welcome to Tabib DZ API');
});

app.get('/api', (req, res) => {
  return sendSuccess(res, { 
    message: 'Tabib DZ API is running',
    version: '1.0.0'
  });
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

    return sendSuccess(res, {
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount
    }, 'Public statistics retrieved successfully');
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
