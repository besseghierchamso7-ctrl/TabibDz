const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

class NotificationService {
  // Email transporter
  static emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Twilio client for SMS and WhatsApp
  static twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  // Send email notification
  static async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
      };

      const info = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }

  // Send SMS notification
  static async sendSMS({ to, body }) {
    try {
      const message = await this.twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      console.log('SMS sent:', message.sid);
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('SMS error:', error);
      throw error;
    }
  }

  // Send WhatsApp notification
  static async sendWhatsApp({ to, body, mediaUrl }) {
    try {
      const messageData = {
        body,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`
      };

      if (mediaUrl) {
        messageData.mediaUrl = mediaUrl;
      }

      const message = await this.twilioClient.messages.create(messageData);

      console.log('WhatsApp sent:', message.sid);
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('WhatsApp error:', error);
      throw error;
    }
  }

  // Appointment confirmation
  static async sendAppointmentConfirmation({ patient, doctor, appointment, channels = ['email'] }) {
    const appointmentDate = new Date(appointment.scheduledAt).toLocaleDateString('fr-FR');
    const appointmentTime = new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px;">
        <h2 style="color: #1e40af;">تأكيد موعدك الطبي</h2>
        <p>السلام عليكم ورحمة الله وبركاته</p>
        <p>تم تأكيد موعدك الطبي مع الدكتور ${doctor.user.firstName} ${doctor.user.lastName}</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>التاريخ:</strong> ${appointmentDate}</p>
          <p><strong>الوقت:</strong> ${appointmentTime}</p>
          <p><strong>التخصص:</strong> ${doctor.specialty.name}</p>
          <p><strong>المكان:</strong> ${doctor.clinic?.name || 'العيادة'}</p>
        </div>
        <p>يرجى الحضور قبل 5 دقائق من الموعد المحدد.</p>
        <p>في حالة الاستفسار، لا تتردد في التواصل معنا.</p>
      </div>
    `;

    const smsText = `تم تأكيد موعدك مع د. ${doctor.user.firstName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}`;
    const whatsappText = `✅ تم تأكيد موعدك الطبي!\n\n📋 الدكتور: د. ${doctor.user.firstName} ${doctor.user.lastName}\n📅 التاريخ: ${appointmentDate}\n⏰ الوقت: ${appointmentTime}\n\nيرجى الحضور قبل 5 دقائق`;

    const results = {};

    if (channels.includes('email')) {
      try {
        results.email = await this.sendEmail({
          to: patient.user.email,
          subject: 'تأكيد موعدك الطبي - Tabib DZ',
          html: emailTemplate,
          text: smsText
        });
      } catch (err) {
        results.email = { success: false, error: err.message };
      }
    }

    if (channels.includes('sms')) {
      try {
        results.sms = await this.sendSMS({
          to: patient.user.phone,
          body: smsText
        });
      } catch (err) {
        results.sms = { success: false, error: err.message };
      }
    }

    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await this.sendWhatsApp({
          to: patient.user.phone,
          body: whatsappText
        });
      } catch (err) {
        results.whatsapp = { success: false, error: err.message };
      }
    }

    return results;
  }

  // Appointment reminder
  static async sendAppointmentReminder({ patient, doctor, appointment, channels = ['email'] }) {
    const appointmentTime = new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px;">
        <h2 style="color: #dc2626;">⏰ تذكير بموعدك الطبي</h2>
        <p>السلام عليكم ورحمة الله وبركاته</p>
        <p>هذا تذكير بموعدك الطبي مع الدكتور ${doctor.user.firstName} ${doctor.user.lastName}</p>
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p><strong>الموعد:</strong> اليوم - الساعة ${appointmentTime}</p>
          <p><strong>المكان:</strong> ${doctor.clinic?.name || 'العيادة'}</p>
        </div>
        <p>🙏 يرجى عدم نسيان الموعد.</p>
      </div>
    `;

    const smsText = `تذكير: موعدك مع د. ${doctor.user.firstName} اليوم الساعة ${appointmentTime}`;
    const whatsappText = `⏰ تذكير موعدك الطبي\n\nالدكتور: د. ${doctor.user.firstName} ${doctor.user.lastName}\nالوقت: ${appointmentTime} (اليوم)\n\n✨ لا تنسى الحضور`;

    const results = {};

    if (channels.includes('email')) {
      try {
        results.email = await this.sendEmail({
          to: patient.user.email,
          subject: 'تذكير: موعدك الطبي - Tabib DZ',
          html: emailTemplate,
          text: smsText
        });
      } catch (err) {
        results.email = { success: false, error: err.message };
      }
    }

    if (channels.includes('sms')) {
      try {
        results.sms = await this.sendSMS({
          to: patient.user.phone,
          body: smsText
        });
      } catch (err) {
        results.sms = { success: false, error: err.message };
      }
    }

    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await this.sendWhatsApp({
          to: patient.user.phone,
          body: whatsappText
        });
      } catch (err) {
        results.whatsapp = { success: false, error: err.message };
      }
    }

    return results;
  }

  // Queue position update
  static async sendQueueUpdate({ patient, queueInfo, channels = ['sms', 'whatsapp'] }) {
    const smsText = `🎯 تحديث قائمة الانتظار: أنت في المركز #${queueInfo.position} (${queueInfo.estimatedWaitTime} دقيقة)`;
    const whatsappText = `🎯 تحديث قائمة الانتظار\n\n📍 موقعك: #${queueInfo.position}\n⏱️ وقت الانتظار المتوقع: ${queueInfo.estimatedWaitTime} دقيقة\n👥 عدد المرضى أمامك: ${queueInfo.patientsAhead}`;

    const results = {};

    if (channels.includes('sms')) {
      try {
        results.sms = await this.sendSMS({
          to: patient.user.phone,
          body: smsText
        });
      } catch (err) {
        results.sms = { success: false, error: err.message };
      }
    }

    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await this.sendWhatsApp({
          to: patient.user.phone,
          body: whatsappText
        });
      } catch (err) {
        results.whatsapp = { success: false, error: err.message };
      }
    }

    return results;
  }

  // Cancellation notification
  static async sendCancellationNotification({ patient, doctor, appointment, channels = ['email'] }) {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px;">
        <h2 style="color: #f59e0b;">📋 تم إلغاء الموعد</h2>
        <p>السلام عليكم ورحمة الله وبركاته</p>
        <p>تم إلغاء موعدك الطبي مع الدكتور ${doctor.user.firstName} ${doctor.user.lastName}</p>
        <p>في حالة الرغبة في حجز موعد جديد، يمكنك الرجوع إلى التطبيق.</p>
      </div>
    `;

    const smsText = `تم إلغاء موعدك مع د. ${doctor.user.firstName}. يمكنك حجز موعد جديد عبر التطبيق.`;
    const whatsappText = `❌ تم إلغاء الموعد\n\nالدكتور: د. ${doctor.user.firstName} ${doctor.user.lastName}\n\nيمكنك حجز موعد جديد من التطبيق`;

    const results = {};

    if (channels.includes('email')) {
      try {
        results.email = await this.sendEmail({
          to: patient.user.email,
          subject: 'إلغاء الموعد الطبي - Tabib DZ',
          html: emailTemplate,
          text: smsText
        });
      } catch (err) {
        results.email = { success: false, error: err.message };
      }
    }

    if (channels.includes('sms')) {
      try {
        results.sms = await this.sendSMS({
          to: patient.user.phone,
          body: smsText
        });
      } catch (err) {
        results.sms = { success: false, error: err.message };
      }
    }

    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await this.sendWhatsApp({
          to: patient.user.phone,
          body: whatsappText
        });
      } catch (err) {
        results.whatsapp = { success: false, error: err.message };
      }
    }

    return results;
  }

  // Waiting list offer notification
  static async sendWaitingListOffer({ patient, doctor, appointment, channels = ['email'] }) {
    const appointmentDate = new Date(appointment.scheduledAt).toLocaleDateString('fr-FR');
    const appointmentTime = new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px;">
        <h2 style="color: #059669;">✨ عرض جديد لك!</h2>
        <p>السلام عليكم ورحمة الله وبركاته</p>
        <p>هناك موعد متاح لك مع الدكتور ${doctor.user.firstName} ${doctor.user.lastName}</p>
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <p><strong>📅 التاريخ:</strong> ${appointmentDate}</p>
          <p><strong>⏰ الوقت:</strong> ${appointmentTime}</p>
        </div>
        <p>🎯 <strong>هذا العرض صالح فقط لمدة 24 ساعة</strong></p>
        <p>قم بقبول العرض أو رفضه من خلال التطبيق.</p>
      </div>
    `;

    const smsText = `🎁 عرض جديد: موعد متاح مع د. ${doctor.user.firstName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}. العرض صالح 24 ساعة فقط!`;
    const whatsappText = `✨ عرض موعد جديد!\n\n📋 الدكتور: د. ${doctor.user.firstName} ${doctor.user.lastName}\n📅 التاريخ: ${appointmentDate}\n⏰ الوقت: ${appointmentTime}\n\n⏱️ هذا العرض صالح 24 ساعة فقط\n\n👆 اضغط على التطبيق للقبول أو الرفض`;

    const results = {};

    if (channels.includes('email')) {
      try {
        results.email = await this.sendEmail({
          to: patient.user.email,
          subject: '✨ عرض موعد جديد - Tabib DZ',
          html: emailTemplate,
          text: smsText
        });
      } catch (err) {
        results.email = { success: false, error: err.message };
      }
    }

    if (channels.includes('sms')) {
      try {
        results.sms = await this.sendSMS({
          to: patient.user.phone,
          body: smsText
        });
      } catch (err) {
        results.sms = { success: false, error: err.message };
      }
    }

    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await this.sendWhatsApp({
          to: patient.user.phone,
          body: whatsappText
        });
      } catch (err) {
        results.whatsapp = { success: false, error: err.message };
      }
    }

    return results;
  }
}

module.exports = NotificationService;
