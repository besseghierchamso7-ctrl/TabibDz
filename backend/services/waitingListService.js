const WaitingList = require('../models/WaitingList');
const Appointment = require('../models/Appointment');

class WaitingListService {
  // Add patient to waiting list
  static async addToWaitingList(patientId, doctorId, data) {
    try {
      const waitingListEntry = new WaitingList({
        patient: patientId,
        doctor: doctorId,
        clinic: data.clinicId,
        specialty: data.specialtyId,
        reason: data.reason,
        preferredDates: data.preferredDates,
        preferredTimes: data.preferredTimes,
        priority: data.priority || 'normal',
        notificationChannels: data.notificationChannels || ['email']
      });

      await waitingListEntry.save();
      return waitingListEntry.populate(['patient', 'doctor', 'clinic', 'specialty']);
    } catch (error) {
      throw error;
    }
  }

  // Get waiting list for doctor
  static async getWaitingListByDoctor(doctorId, status = 'active') {
    try {
      return WaitingList.find({ doctor: doctorId, status })
        .populate(['patient', 'clinic', 'specialty'])
        .sort({ priority: -1, requestedAt: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Check and offer available slots
  static async checkAndOfferSlots(doctorId, clinicId) {
    try {
      const waitingList = await WaitingList.find({
        doctor: doctorId,
        status: { $in: ['active', 'offered'] }
      }).populate('patient');

      const futureAppointments = await Appointment.find({
        doctor: doctorId,
        scheduledAt: { $gt: new Date() },
        status: 'available'
      }).sort({ scheduledAt: 1 });

      const results = [];

      for (const waitEntry of waitingList) {
        for (const appointment of futureAppointments) {
          // Check if appointment matches waiting list preferences
          if (
            (!waitEntry.preferredDates.length ||
              waitEntry.preferredDates.some(d => new Date(d).toDateString() === new Date(appointment.scheduledAt).toDateString())) &&
            (!waitEntry.preferredTimes.length ||
              waitEntry.preferredTimes.includes(new Date(appointment.scheduledAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })))
          ) {
            // Offer the slot
            waitEntry.status = 'offered';
            waitEntry.offeredAppointment = appointment._id;
            waitEntry.offeredAt = new Date();
            waitEntry.notified = false;

            await waitEntry.save();
            results.push({ waitingListId: waitEntry._id, appointmentId: appointment._id });

            // Mark appointment as offered (not available anymore)
            appointment.status = 'pending';
            await appointment.save();
            break;
          }
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Accept offered slot
  static async acceptOffer(waitingListId, patientId) {
    try {
      const waitEntry = await WaitingList.findById(waitingListId);
      if (!waitEntry || waitEntry.patient.toString() !== patientId.toString()) {
        throw new Error('Unauthorized or waiting list entry not found');
      }

      if (waitEntry.status !== 'offered') {
        throw new Error('No active offer for this patient');
      }

      const appointment = await Appointment.findById(waitEntry.offeredAppointment);
      if (!appointment) throw new Error('Appointment not found');

      // Confirm appointment
      appointment.status = 'confirmed';
      appointment.patient = patientId;
      await appointment.save();

      // Update waiting list
      waitEntry.status = 'booked';
      waitEntry.acceptedOffer = true;
      waitEntry.acceptedAt = new Date();
      await waitEntry.save();

      return appointment;
    } catch (error) {
      throw error;
    }
  }

  // Decline offered slot
  static async declineOffer(waitingListId, patientId) {
    try {
      const waitEntry = await WaitingList.findById(waitingListId);
      if (!waitEntry || waitEntry.patient.toString() !== patientId.toString()) {
        throw new Error('Unauthorized or waiting list entry not found');
      }

      if (waitEntry.status !== 'offered') {
        throw new Error('No active offer for this patient');
      }

      const appointment = await Appointment.findById(waitEntry.offeredAppointment);
      if (appointment) {
        appointment.status = 'available';
        await appointment.save();
      }

      waitEntry.status = 'active';
      waitEntry.offeredAppointment = null;
      waitEntry.offeredAt = null;
      await waitEntry.save();

      return waitEntry;
    } catch (error) {
      throw error;
    }
  }

  // Get patient's waiting list entries
  static async getPatientWaitingList(patientId) {
    try {
      return WaitingList.find({ patient: patientId, status: { $ne: 'cancelled' } })
        .populate(['doctor', 'clinic', 'specialty'])
        .sort({ requestedAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  // Cancel waiting list entry
  static async cancelWaitingList(waitingListId, patientId) {
    try {
      const waitEntry = await WaitingList.findById(waitingListId);
      if (!waitEntry || waitEntry.patient.toString() !== patientId.toString()) {
        throw new Error('Unauthorized');
      }

      waitEntry.status = 'cancelled';
      await waitEntry.save();

      return waitEntry;
    } catch (error) {
      throw error;
    }
  }

  // Mark as notified
  static async markAsNotified(waitingListId) {
    try {
      return WaitingList.findByIdAndUpdate(waitingListId, { notified: true, notifiedAt: new Date() }, { new: true });
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStatistics(doctorId) {
    try {
      const stats = {
        totalWaiting: await WaitingList.countDocuments({ doctor: doctorId, status: 'active' }),
        totalOffered: await WaitingList.countDocuments({ doctor: doctorId, status: 'offered' }),
        totalBooked: await WaitingList.countDocuments({ doctor: doctorId, status: 'booked' }),
        totalExpired: await WaitingList.countDocuments({ doctor: doctorId, status: 'expired' })
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WaitingListService;
