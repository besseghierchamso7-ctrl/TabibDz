let io = null;

function setIO(serverIo) {
  io = serverIo;
}

function extractRoomTargetId(room) {
  if (!room) return null;
  const doctorMatch = room.match(/^doctor_([^_]+)(?:_clinic_.*)?$/);
  if (doctorMatch) return doctorMatch[1];
  const patientMatch = room.match(/^patient_([^_]+)(?:_clinic_.*)?$/);
  if (patientMatch) return patientMatch[1];
  return null;
}

async function emit(event, room, payload) {
  if (!io) return;
  try {
    if (room) {
      // patient_<id> rooms should only emit to sockets whose authenticated user id matches the patient id
      if (room.startsWith('patient_') && !room.includes('_clinic_')) {
        const targetId = extractRoomTargetId(room);
        if (targetId) {
          const sockets = await io.in(room).fetchSockets();
          let emitted = false;
          for (const s of sockets) {
            const sockUser = s.user || s.handshake?.user;
            const sockUserId = sockUser?._id || sockUser?.id || (sockUser?._doc && sockUser._doc._id);
            if (sockUserId && String(sockUserId) === String(targetId)) {
              s.emit(event, payload);
              emitted = true;
            }
          }
          return emitted;
        }
      }
      // For compound doctor_<id>_clinic_<clinicId> rooms and generic room broadcasts, emit directly to the room
      return io.to(room).emit(event, payload);
    }
    return io.emit(event, payload);
  } catch (e) {
    if (room) return io.to(room).emit(event, payload);
    return io.emit(event, payload);
  }
}

function getIO() { return io; }

module.exports = { setIO, emit, getIO };
