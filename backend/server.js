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
      Doctor.countDocuments({ isVerified: true }),
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
