const Queue = require('../models/Queue');

exports.getQueueForClinic = async (clinicId) => Queue.findOne({ clinic: clinicId });

exports.addEntry = async (clinicId, entry) => {
  const q = await Queue.findOneAndUpdate(
    { clinic: clinicId },
    { $push: { entries: entry } },
    { upsert: true, new: true }
  );
  return q;
};

exports.callNext = async (clinicId) => {
  const q = await Queue.findOne({ clinic: clinicId });
  if (!q || !q.entries.length) return null;
  const next = q.entries.find(e => e.status === 'waiting');
  if (!next) return null;
  next.status = 'called';
  await q.save();
  return next;
};
