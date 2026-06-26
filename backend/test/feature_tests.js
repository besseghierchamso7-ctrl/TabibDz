const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Review = require('../models/Review');
const Specialty = require('../models/Specialty');
const Wilaya = require('../models/Wilaya');
const Teleconsultation = require('../models/Teleconsultation');
const clinicStaffService = require('../services/clinicStaffService');
const AnalyticsService = require('../services/analyticsService');
const teleconsultationService = require('../services/teleconsultationService');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required for tests');
  process.exit(1);
}

const TEST_PREFIX = `tabib-test-${Date.now()}`;

const connectDB = async () => {
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 5,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000,
  });
};

const cleanup = async (created) => {
  const ids = Object.values(created).map((item) => item?._id || item?.id).filter(Boolean);
  if (created.teleconsultation) await Teleconsultation.deleteOne({ _id: created.teleconsultation._id }).catch(() => {});
  if (created.prescription) await Prescription.deleteOne({ _id: created.prescription._id }).catch(() => {});
  if (created.review) await Review.deleteOne({ _id: created.review._id }).catch(() => {});
  if (created.appointment) await Appointment.deleteOne({ _id: created.appointment._id }).catch(() => {});
  if (created.clinic) await Clinic.deleteOne({ _id: created.clinic._id }).catch(() => {});
  if (created.patient) await Patient.deleteOne({ _id: created.patient._id }).catch(() => {});
  if (created.doctor) await Doctor.deleteOne({ _id: created.doctor._id }).catch(() => {});
  if (created.users) {
    await User.deleteMany({ email: { $in: created.users.map((user) => user.email) } }).catch(() => {});
  }
  if (created.specialty) await Specialty.deleteOne({ _id: created.specialty._id }).catch(() => {});
  if (created.wilaya) await Wilaya.deleteOne({ _id: created.wilaya._id }).catch(() => {});
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const run = async () => {
  console.log('🧪 Running backend feature tests...');
  await connectDB();

  const created = {};
  try {
    const specialty = await Specialty.create({ name: `${TEST_PREFIX}-Specialty` });
    const wilaya = await Wilaya.create({ name: `${TEST_PREFIX}-Wilaya`, code: 99 });
    created.specialty = specialty;
    created.wilaya = wilaya;

    const admin = await User.create({
      firstName: 'Test',
      lastName: 'Admin',
      email: `${TEST_PREFIX}-admin@tabibdz.com`,
      password: 'Admin1234',
      role: 'admin',
      isVerified: true
    });
    const manager = await User.create({
      firstName: 'Test',
      lastName: 'Manager',
      email: `${TEST_PREFIX}-manager@tabibdz.com`,
      password: 'Manager1234',
      role: 'clinic_manager',
      isVerified: true
    });
    const patientUser = await User.create({
      firstName: 'Test',
      lastName: 'Patient',
      email: `${TEST_PREFIX}-patient@tabibdz.com`,
      password: 'Patient1234',
      role: 'patient',
      isVerified: true
    });
    const doctorUser = await User.create({
      firstName: 'Test',
      lastName: 'Doctor',
      email: `${TEST_PREFIX}-doctor@tabibdz.com`,
      password: 'Doctor1234',
      role: 'doctor',
      isVerified: true
    });
    created.users = [admin, manager, patientUser, doctorUser];

    const patient = await Patient.create({
      user: patientUser._id,
      birthDate: new Date('1985-05-10'),
      address: 'Test Address'
    });
    created.patient = patient;

    const doctor = await Doctor.create({
      user: doctorUser._id,
      specialty: specialty._id,
      wilaya: wilaya._id,
      consultationPrice: 2000,
      status: 'verified',
      availability: { monday: { enabled: true, startTime: '09:00', endTime: '17:00' } }
    });
    created.doctor = doctor;

    const clinic = await Clinic.create({
      name: `${TEST_PREFIX} Clinic`,
      address: 'Test Clinic Street',
      wilaya: wilaya._id,
      phone: '0550 000 000',
      verified: true,
      managers: [manager._id]
    });
    created.clinic = clinic;

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      reason: 'Test consultation',
      price: 2000,
      paymentStatus: 'pending'
    });
    created.appointment = appointment;

    const prescription = await Prescription.create({
      patient: patient._id,
      doctor: doctor._id,
      medications: [{ name: 'Ibuprofen', dosage: '200mg', instructions: 'Take twice daily after meals' }],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Test prescription'
    });
    created.prescription = prescription;

    const review = await Review.create({
      patient: patient._id,
      doctor: doctor._id,
      rating: 4,
      comment: 'Test review'
    });
    created.review = review;

    const teleconsultation = await Teleconsultation.create({
      appointment: appointment._id,
      doctor: doctor._id,
      patient: patient._id,
      clinic: clinic._id,
      roomName: `${TEST_PREFIX}-room`,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'scheduled'
    });
    created.teleconsultation = teleconsultation;

    // Clinic staff service tests
    const assignedClinic = await clinicStaffService.assignManager(clinic._id, manager._id);
    assert(assignedClinic.managers.some((m) => String(m) === String(manager._id)), 'Manager should be assigned to clinic');

    const managers = await clinicStaffService.listManagers(clinic._id);
    assert(Array.isArray(managers), 'Managers list should be an array');
    assert(managers.some((m) => String(m._id) === String(manager._id)), 'Assigned manager should appear in list');

    const removedClinic = await clinicStaffService.removeManager(clinic._id, manager._id);
    assert(!removedClinic.managers.some((m) => String(m) === String(manager._id)), 'Manager should be removed from clinic');

    // Analytics service tests
    const overview = await AnalyticsService.getOverview();
    assert(typeof overview.prescriptionsCount === 'number', 'Overview should include prescriptionsCount');
    assert(typeof overview.teleconsultCount === 'number', 'Overview should include teleconsultCount');
    assert(typeof overview.reviewsCount === 'number', 'Overview should include reviewsCount');
    assert(typeof overview.appointmentsCount === 'number', 'Overview should include appointmentsCount');

    const doctorAnalytics = await AnalyticsService.getDoctorAnalytics(doctor._id);
    assert(doctorAnalytics.prescriptions >= 1, 'Doctor analytics should count prescriptions');
    assert(doctorAnalytics.teleconsults >= 1, 'Doctor analytics should count teleconsultations');
    assert(doctorAnalytics.appointments >= 1, 'Doctor analytics should count appointments');
    assert(doctorAnalytics.totalReviews >= 1, 'Doctor analytics should count reviews');

    // Teleconsultation service tests
    const fetchedSession = await teleconsultationService.getByRoomName(teleconsultation.roomName);
    assert(fetchedSession && String(fetchedSession._id) === String(teleconsultation._id), 'Should fetch teleconsultation by room name');

    const updatedSession = await teleconsultationService.updateStatus(teleconsultation._id, 'in_progress');
    assert(updatedSession.status === 'in_progress', 'Teleconsultation status should update to in_progress');

    console.log('✅ Feature tests passed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Feature tests failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await cleanup(created);
    await mongoose.disconnect();
  }
};

run();
