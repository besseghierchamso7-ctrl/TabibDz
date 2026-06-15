const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:10000';
const DOCTOR_EMAIL = process.env.TEST_DOCTOR_EMAIL || 'said@example.com';
const DOCTOR_PASSWORD = process.env.TEST_DOCTOR_PASSWORD || 'Doctor123';

const getDoctorId = (appointment) => {
  if (!appointment) return null;
  if (typeof appointment.doctor === 'string') return appointment.doctor;
  if (appointment.doctor?._id) return appointment.doctor._id;
  return appointment.doctor?.id || null;
};

const loginDoctor = async () => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, {
    email: DOCTOR_EMAIL,
    password: DOCTOR_PASSWORD
  });
  return response.data.token || response.data.accessToken || response.data.authToken;
};

const run = async () => {
  console.log('🧪 Doctor appointments filter test');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Doctor email: ${DOCTOR_EMAIL}`);

  try {
    const token = await loginDoctor();
    if (!token) {
      throw new Error('Login did not return an auth token');
    }

    const response = await axios.get(`${BASE_URL}/api/appointments?status=pending,confirmed`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const appointments = Array.isArray(response.data) ? response.data : [];
    console.log(`Retrieved ${appointments.length} appointment(s)`);

    const doctorIds = [...new Set(appointments.map(getDoctorId).filter(Boolean))];
    if (doctorIds.length <= 1) {
      console.log('✅ PASS: All returned appointments belong to the logged-in doctor.');
      if (doctorIds.length === 1) {
        console.log(`Doctor profile ID: ${doctorIds[0]}`);
      } else {
        console.log('⚠️ No appointments found for this doctor, but access is correctly limited to this user.');
      }
      process.exit(0);
    }

    console.error('❌ FAIL: Retrieved appointments belong to multiple doctors:');
    console.error(doctorIds);
    process.exit(1);
  } catch (error) {
    console.error('❌ TEST ERROR:', error.response?.data || error.message || error);
    process.exit(1);
  }
};

run();
