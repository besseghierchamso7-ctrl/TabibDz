const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const jwt = require('jsonwebtoken');
const socketService = require('../services/socketService');

const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

async function run() {
  const server = http.createServer();
  const io = new Server(server, { cors: { origin: '*' } });
  socketService.setIO(io);

  io.on('connection', (socket) => {
    const token = socket.handshake?.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = { _id: decoded.id, role: decoded.role };
        if (decoded.role === 'patient') socket.join(`patient_${decoded.id}`);
        if (decoded.role === 'doctor') socket.join(`doctor_${decoded.id}`);
      } catch (e) {
        // ignore
      }
    }
  });

  server.listen(PORT, () => console.log(`Test socket server listening ${PORT}`));

  // create a patient and a doctor client
  const patientToken = jwt.sign({ id: 'patient1', role: 'patient' }, JWT_SECRET);
  const doctorToken = jwt.sign({ id: 'doctor1', role: 'doctor' }, JWT_SECRET);

  const patientSocket = ioClient.connect(`http://localhost:${PORT}`, { auth: { token: patientToken }, transports: ['websocket'] });
  const doctorSocket = ioClient.connect(`http://localhost:${PORT}`, { auth: { token: doctorToken }, transports: ['websocket'] });

  patientSocket.on('connect', () => console.log('patient connected', patientSocket.id));
  doctorSocket.on('connect', () => console.log('doctor connected', doctorSocket.id));

  patientSocket.on('waitingList:offer', (payload) => {
    console.log('patient received offer', payload);
  });
  doctorSocket.on('waitingList:offer', (payload) => {
    console.log('doctor received offer', payload);
  });
  doctorSocket.on('waitingList:offersCreated', (payload) => {
    console.log('doctor received offersCreated', payload);
  });

  // wait for clients to connect
  await new Promise((r) => setTimeout(r, 1000));

  // join the clinic-specific doctor room and make sure compound room emits are handled
  doctorSocket.emit('joinRoom', 'doctor_doctor1_clinic_default');
  await new Promise((r) => setTimeout(r, 300));

  // emit an offer to patient_patient1 room
  console.log('Emitting offer to patient_patient1');
  const emitted = await socketService.emit('waitingList:offer', 'patient_patient1', { patientId: 'patient1', waitingListId: 'wl1', offeredSlot: '2026-06-20 10:00' });
  console.log('Emit result:', emitted);

  // emit to doctor clinic room via compound room pattern
  console.log('Emitting waitingList:offersCreated to doctor_doctor1_clinic_default');
  const emittedDoctorRoom = await socketService.emit('waitingList:offersCreated', 'doctor_doctor1_clinic_default', { count: 1 });
  console.log('Emit result for compound doctor room:', emittedDoctorRoom);

  // wait a bit then cleanup
  setTimeout(() => {
    patientSocket.disconnect();
    doctorSocket.disconnect();
    server.close();
    process.exit(0);
  }, 1500);
}

run().catch(err => { console.error(err); process.exit(1); });
