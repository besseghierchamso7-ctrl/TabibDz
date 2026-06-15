const Queue = require('../models/Queue');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

class QueueService {
  // Join queue for doctor
  static async joinQueue(doctorId, clinicId, patientId, appointmentId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let queue = await Queue.findOne({
        doctor: doctorId,
        clinic: clinicId,
        date: { $gte: today, $lt: tomorrow },
        status: 'open'
      });

      if (!queue) {
        queue = new Queue({
          doctor: doctorId,
          clinic: clinicId,
          date: today,
          status: 'open'
        });
      }

      const queueNumber = queue.getNextQueueNumber();
      const position = queue.entries.length + 1;
      const estimatedWaitTime = queue.getEstimatedWaitTime(position);

      queue.entries.push({
        patient: patientId,
        appointment: appointmentId,
        queueNumber,
        status: 'waiting',
        estimatedWaitTime
      });

      await queue.save();
      return { queueNumber, position, estimatedWaitTime, queue };
    } catch (error) {
      throw error;
    }
  }

  // Get patient queue status
  static async getQueueStatus(doctorId, clinicId, patientId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const queue = await Queue.findOne({
        doctor: doctorId,
        clinic: clinicId,
        date: { $gte: today, $lt: tomorrow }
      });

      if (!queue) {
        return { message: 'No queue found', position: -1 };
      }

      const position = queue.getPatientPosition(patientId);
      if (position === -1) {
        return { message: 'Patient not in queue', position: -1 };
      }

      const estimatedWaitTime = queue.getEstimatedWaitTime(position);
      return {
        position,
        currentNumber: queue.currentNumber,
        estimatedWaitTime,
        patientsAhead: position - 1,
        totalInQueue: queue.entries.filter(e => e.status === 'waiting').length,
        queueStatus: queue.status
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorQueueSummary(doctorId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const queue = await Queue.findOne({
        doctor: doctorId,
        status: 'open',
        date: { $gte: today, $lt: tomorrow }
      });

      if (!queue) {
        return {
          hasQueue: false,
          message: 'Aucune file d\'attente active',
          currentNumber: 0,
          totalInQueue: 0,
          remainingPatients: 0,
          nextQueueNumber: null,
          estimatedWaitTime: 0,
          queueStatus: 'closed'
        };
      }

      const waitingEntries = queue.entries.filter(e => e.status === 'waiting');
      const nextEntry = waitingEntries[0];
      const remainingPatients = waitingEntries.length;
      const estimatedWaitTime = remainingPatients * 15;

      return {
        hasQueue: true,
        currentNumber: queue.currentNumber,
        totalInQueue: remainingPatients,
        remainingPatients,
        nextQueueNumber: nextEntry?.queueNumber || null,
        estimatedWaitTime,
        queueStatus: queue.status,
        clinic: queue.clinic
      };
    } catch (error) {
      throw error;
    }
  }

  // Call next patient
  static async callNextPatient(doctorId, clinicId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const query = {
        doctor: doctorId,
        date: { $gte: today, $lt: tomorrow }
      };
      if (clinicId) query.clinic = clinicId;

      const queue = await Queue.findOne(query);

      if (!queue) throw new Error('Queue not found');

      const nextEntry = queue.entries.find(e => e.status === 'waiting');
      if (!nextEntry) throw new Error('No patients waiting');

      nextEntry.status = 'called';
      nextEntry.calledAt = new Date();
      queue.currentNumber = nextEntry.queueNumber;

      await queue.save();
      return { nextEntry, queueNumber: nextEntry.queueNumber };
    } catch (error) {
      throw error;
    }
  }

  // Mark patient as served
  static async markAsServed(doctorId, clinicId, patientQueueId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const queue = await Queue.findOne({
        doctor: doctorId,
        clinic: clinicId,
        date: { $gte: today, $lt: tomorrow }
      });

      if (!queue) throw new Error('Queue not found');

      const entry = queue.entries.id(patientQueueId);
      if (!entry) throw new Error('Queue entry not found');

      const actualWaitTime = Math.round((new Date() - entry.joinedAt) / 60000);
      entry.status = 'served';
      entry.servedAt = new Date();
      entry.actualWaitTime = actualWaitTime;
      queue.totalServed += 1;

      await queue.save();
      return { entry, actualWaitTime };
    } catch (error) {
      throw error;
    }
  }

  // Get queue for clinic
  static async getQueueForClinic(clinicId) {
    return Queue.findOne({ clinic: clinicId }).populate('doctor');
  }

  // Get queue analytics
  static async getQueueAnalytics(doctorId, startDate, endDate) {
    try {
      const queues = await Queue.find({
        doctor: doctorId,
        date: { $gte: startDate, $lte: endDate }
      });

      const stats = {
        totalDays: queues.length,
        totalServed: queues.reduce((sum, q) => sum + q.totalServed, 0),
        totalNoShow: queues.reduce((sum, q) => sum + q.totalNoShow, 0),
        totalSkipped: queues.reduce((sum, q) => sum + q.totalSkipped, 0),
        avgWaitTime: 0
      };

      const allEntries = queues.flatMap(q => q.entries.filter(e => e.actualWaitTime));
      if (allEntries.length > 0) {
        const totalWaitTime = allEntries.reduce((sum, e) => sum + e.actualWaitTime, 0);
        stats.avgWaitTime = Math.round(totalWaitTime / allEntries.length);
      }

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QueueService;
