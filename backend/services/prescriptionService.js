const Prescription = require('../models/Prescription');
const crypto = require('crypto');

class PrescriptionService {
	static async create(data) {
		const presc = await new Prescription(data).save();
		// generate a small QR-like hash for quick verification
		presc.qrHash = crypto.createHash('sha256').update(presc._id.toString()).digest('hex').slice(0, 12);
		await presc.save();
		return presc;
	}

	static async listByPatient(patientId, limit = 50) {
		return Prescription.find({ patient: patientId }).populate('doctor').sort({ createdAt: -1 }).limit(limit).exec();
	}

	static async listByDoctor(doctorId, limit = 50) {
		return Prescription.find({ doctor: doctorId }).populate('patient').sort({ createdAt: -1 }).limit(limit).exec();
	}

	static async getById(id) {
		return Prescription.findById(id).populate('doctor patient');
	}

	static async revoke(id, doctorId) {
		const presc = await Prescription.findOne({ _id: id, doctor: doctorId });
		if (!presc) throw new Error('Not found or unauthorized');
		presc.isActive = false;
		await presc.save();
		return presc;
	}
}

module.exports = PrescriptionService;
