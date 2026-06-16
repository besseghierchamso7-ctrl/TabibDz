require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 5 });
    const User = require('../models/User');
    const Doctor = require('../models/Doctor');
    const Patient = require('../models/Patient');
    const Appointment = require('../models/Appointment');
    const Review = require('../models/Review');

    const users = await User.find({ role: { $in: ['doctor', 'patient'] } }).select('_id');
    const userIds = users.map((u) => u._id);

    const patients = await Patient.find({ user: { $in: userIds } }).select('_id');
    const patientIds = patients.map((p) => p._id);

    const doctors = await Doctor.find({ user: { $in: userIds } }).select('_id');
    const doctorIds = doctors.map((d) => d._id);

    const apptRes = await Appointment.deleteMany({ $or: [{ patient: { $in: patientIds } }, { doctor: { $in: doctorIds } }] });
    const reviewRes = await Review.deleteMany({ $or: [{ patient: { $in: patientIds } }, { doctor: { $in: doctorIds } }] });

    const patientRes = await Patient.deleteMany({ user: { $in: userIds } });
    const doctorRes = await Doctor.deleteMany({ user: { $in: userIds } });

    const userRes = await User.deleteMany({ _id: { $in: userIds } });

    console.log('Deleted counts:', JSON.stringify({ users: userRes.deletedCount, doctors: doctorRes.deletedCount, patients: patientRes.deletedCount, appointments: apptRes.deletedCount, reviews: reviewRes.deletedCount }));
    await mongoose.disconnect();
    // exit 0
    process.exit(0);
  } catch (err) {
    console.error('Error deleting accounts:', err);
    process.exit(1);
  }
})();
