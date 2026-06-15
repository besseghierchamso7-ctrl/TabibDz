let io = null;

function setIO(serverIo) {
  io = serverIo;
}

async function emit(event, room, payload) {
  if (!io) return;
  // If targeting a patient_<id> or doctor_<id> room, verify connected sockets belong to that user
  try {
    if (room && (room.startsWith('patient_') || room.startsWith('doctor_'))) {
      const parts = room.split('_');
      const targetId = parts.slice(1).join('_');
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
      // If no authenticated socket matched, do not emit to avoid leaking data
      return emitted;
    }
    if (room) {
      return io.to(room).emit(event, payload);
    }
    return io.emit(event, payload);
  } catch (e) {
    // fallback to simple emit on error
    if (room) return io.to(room).emit(event, payload);
    return io.emit(event, payload);
  }
}

function getIO() { return io; }

module.exports = { setIO, emit, getIO };
