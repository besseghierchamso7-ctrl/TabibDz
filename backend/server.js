const express = require('express');
const path = require('path');
const cors = require('cors');
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
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

connectDB();

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');
const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = [process.env.CLIENT_URL, ...localOrigins].map(normalizeOrigin).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin);
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(helmet());
app.use(xssClean());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimiter);
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
