const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const Wilaya = require('../models/Wilaya');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

dotenv.config();

dns.setServers(['1.1.1.1', '8.8.8.8']);
console.log('Seed DNS servers:', dns.getServers());

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Patient.deleteMany();
    await Doctor.deleteMany();
    await Specialty.deleteMany();
    await Wilaya.deleteMany();
    await Appointment.deleteMany();
    await Review.deleteMany();

    const specialties = await Specialty.insertMany([
      { name: 'Médecine Générale' },
      { name: 'Urologie' },
      { name: 'Pneumologie' },
      { name: 'Gastro-entérologie' },
      { name: 'Psychiatrie' },
      { name: 'Psychologie' },
      { name: 'Rhumatologie' },
      { name: 'Cardiologie' },
      { name: 'Dermatologie' },
      { name: 'Neurologie' },
      { name: 'Endocrinologie' },
      { name: 'Gynécologie-Obstétrique' },
      { name: 'Pédiatrie' },
      { name: 'Ophtalmologie' },
      { name: 'ORL (Oto-rhino-laryngologie)' },
      { name: 'Orthopédie-Traumatologie' },
      { name: 'Néphrologie' },
      { name: 'Oncologie' },
      { name: 'Hématologie' },
      { name: 'Infectiologie' },
      { name: 'Médecine Interne' }
    ]);

    const wilayas = await Wilaya.insertMany([
      { name: 'Alger', code: 16 },
      { name: 'Oran', code: 31 },
      { name: 'Constantine', code: 25 }
    ]);

    const admin = await User.create({ firstName: 'Admin', lastName: 'Tabib', email: 'admin@tabibdz.com', password: 'Admin1234', role: 'admin', isVerified: true });
    const patientUser = await User.create({ firstName: 'Nadia', lastName: 'Brahimi', email: 'nadia@example.com', password: 'Patient123', role: 'patient', isVerified: true });
    const patient = await Patient.create({ user: patientUser._id, birthDate: new Date('1990-03-15'), address: 'Alger Centre' });
    const doctorUser = await User.create({ firstName: 'Said', lastName: 'Ait', email: 'said@example.com', password: 'Doctor123', role: 'doctor', isVerified: true });
    const doctor = await Doctor.create({ user: doctorUser._id, specialty: specialties[0]._id, wilaya: wilayas[0]._id, consultationPrice: 3000, status: 'verified', availability: { days: ['monday', 'wednesday', 'friday'], timeSlots: ['09:00', '10:00', '14:00'] } });
    await Appointment.create({ patient: patient._id, doctor: doctor._id, scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'pending', reason: 'Contrôle général', price: 3000, paymentStatus: 'pending' });
    await Review.create({ patient: patient._id, doctor: doctor._id, rating: 5, comment: 'Un excellent médecin' });
    console.log('Seed data imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
