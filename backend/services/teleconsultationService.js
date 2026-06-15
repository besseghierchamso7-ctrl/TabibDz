const Teleconsultation = require('../models/Teleconsultation');
const crypto = require('crypto');

class TeleconsultationService {
  static generateRoomName(prefix = 'tabib') {
    return `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
  }

  static async create({ appointmentId, doctorId, patientId, clinicId, scheduledAt }) {
    const roomName = this.generateRoomName();
    const session = await Teleconsultation.create({
      appointment: appointmentId,
      doctor: doctorId,
      patient: patientId,
      clinic: clinicId,
      scheduledAt,
      roomName,
      status: 'scheduled'
    });
    return session;
  }

  static async getById(id) {
    return Teleconsultation.findById(id).populate('doctor patient appointment');
  }

  static async listByDoctor(doctorId, limit = 50) {
    return Teleconsultation.find({ doctor: doctorId }).sort({ scheduledAt: -1 }).limit(limit).exec();
  }

  static async listByPatient(patientId, limit = 50) {
    return Teleconsultation.find({ patient: patientId }).sort({ scheduledAt: -1 }).limit(limit).exec();
  }

  static async updateStatus(id, status) {
    const sess = await Teleconsultation.findById(id);
    if (!sess) throw new Error('Not found');
    sess.status = status;
    await sess.save();
    return sess;
  }
}

module.exports = TeleconsultationService;
