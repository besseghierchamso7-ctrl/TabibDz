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
const Clinic = require('../models/Clinic');
const Prescription = require('../models/Prescription');
const Teleconsultation = require('../models/Teleconsultation');

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
      { name: "Adrar", code: 1 },
      { name: "Chlef", code: 2 },
      { name: "Laghouat", code: 3 },
      { name: "Oum El Bouaghi", code: 4 },
      { name: "Batna", code: 5 },
      { name: "Béjaïa", code: 6 },
      { name: "Biskra", code: 7 },
      { name: "Béchar", code: 8 },
      { name: "Blida", code: 9 },
      { name: "Bouira", code: 10 },
      { name: "Tamanrasset", code: 11 },
      { name: "Tébessa", code: 12 },
      { name: "Tlemcen", code: 13 },
      { name: "Tiaret", code: 14 },
      { name: "Tizi Ouzou", code: 15 },
      { name: "Alger", code: 16 },
      { name: "Djelfa", code: 17 },
      { name: "Jijel", code: 18 },
      { name: "Sétif", code: 19 },
      { name: "Saïda", code: 20 },
      { name: "Skikda", code: 21 },
      { name: "Sidi Bel Abbès", code: 22 },
      { name: "Annaba", code: 23 },
      { name: "Guelma", code: 24 },
      { name: "Constantine", code: 25 },
      { name: "Médéa", code: 26 },
      { name: "Mostaganem", code: 27 },
      { name: "M'Sila", code: 28 },
      { name: "Mascara", code: 29 },
      { name: "Ouargla", code: 30 },
      { name: "Oran", code: 31 },
      { name: "El Bayadh", code: 32 },
      { name: "Illizi", code: 33 },
      { name: "Bordj Bou Arréridj", code: 34 },
      { name: "Boumerdès", code: 35 },
      { name: "El Tarf", code: 36 },
      { name: "Tindouf", code: 37 },
      { name: "Tissemsilt", code: 38 },
      { name: "El Oued", code: 39 },
      { name: "Khenchela", code: 40 },
      { name: "Souk Ahras", code: 41 },
      { name: "Tipaza", code: 42 },
      { name: "Mila", code: 43 },
      { name: "Aïn Defla", code: 44 },
      { name: "Naâma", code: 45 },
      { name: "Aïn Témouchent", code: 46 },
      { name: "Ghardaïa", code: 47 },
      { name: "Relizane", code: 48 },
      { name: "Timimoun", code: 49 },
      { name: "Bordj Badji Mokhtar", code: 50 },
      { name: "Ouled Djellal", code: 51 },
      { name: "Béni Abbès", code: 52 },
      { name: "In Salah", code: 53 },
      { name: "In Guezzam", code: 54 },
      { name: "Touggourt", code: 55 },
      { name: "Djanet", code: 56 },
      { name: "El Meghaier", code: 57 },
      { name: "El Meniaa", code: 58 },
      { name: "Aflou", code: 59 },
      { name: "Barika", code: 60 },
      { name: "El Kantara", code: 61 },
      { name: "Bir El Ater", code: 62 },
      { name: "El Aricha", code: 63 },
      { name: "Ksar Chellala", code: 64 },
      { name: "Aïn Ouessara", code: 65 },
      { name: "Messaad", code: 66 },
      { name: "Ksar El Boukhari", code: 67 },
      { name: "Bou Saâda", code: 68 },
      { name: "El Abiodh Sidi Cheikh", code: 69 }
    ]);

    const admin = await User.create({ firstName: 'Admin', lastName: 'Tabib', email: 'admin@tabibdz.com', password: 'Admin1234', role: 'admin', isVerified: true });
    const clinicManager = await User.create({ firstName: 'Meriem', lastName: 'Manager', email: 'manager@tabibdz.com', password: 'Manager123', role: 'clinic_manager', isVerified: true });
    const patientUser = await User.create({ firstName: 'Nadia', lastName: 'Brahimi', email: 'nadia@example.com', password: 'Patient123', role: 'patient', isVerified: true });
    const patient = await Patient.create({ user: patientUser._id, birthDate: new Date('1990-03-15'), address: 'Alger Centre' });
    const doctorUser = await User.create({ firstName: 'Said', lastName: 'Ait', email: 'said@example.com', password: 'Doctor123', role: 'doctor', isVerified: true });
    const doctor = await Doctor.create({ user: doctorUser._id, specialty: specialties[0]._id, wilaya: wilayas[0]._id, consultationPrice: 3000, status: 'verified', availability: { days: ['monday', 'wednesday', 'friday'], timeSlots: ['09:00', '10:00', '14:00'] } });
    const clinic = await Clinic.create({
      name: 'Clinique Tabib DZ',
      address: 'Rue Didouche Mourad, Alger',
      wilaya: wilayas[0]._id,
      phone: '0550 123 456',
      verified: true,
      managers: [clinicManager._id]
    });
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      reason: 'Contrôle général',
      price: 3000,
      paymentStatus: 'pending'
    });
    await Prescription.create({
      patient: patient._id,
      doctor: doctor._id,
      medications: [{ name: 'Paracétamol', dosage: '500mg', instructions: '2 fois par jour après les repas' }],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Prescription de base pour test'
    });
    await Teleconsultation.create({
      appointment: appointment._id,
      doctor: doctor._id,
      patient: patient._id,
      clinic: clinic._id,
      roomName: `tabib-test-${Date.now()}`,
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: 'scheduled'
    });
    await Review.create({ patient: patient._id, doctor: doctor._id, rating: 5, comment: 'Un excellent médecin' });
    console.log('Seed data imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
