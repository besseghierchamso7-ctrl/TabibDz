const Review = require('../models/Review');
const Doctor = require('../models/Doctor');

const addReview = async ({ patientId, doctorId, rating, comment, appointmentId }) => {
  const review = await Review.create({ patient: patientId, doctor: doctorId, rating, comment, appointment: appointmentId });
  const doctorReviews = await Review.find({ doctor: doctorId });
  const averageRating = doctorReviews.reduce((acc, item) => acc + item.rating, 0) / doctorReviews.length;
  await Doctor.findByIdAndUpdate(doctorId, { rating: averageRating, totalReviews: doctorReviews.length });
  return review;
};

const getDoctorReviews = async (doctorId) => {
  return Review.find({ doctor: doctorId }).populate('patient', 'user').sort({ createdAt: -1 });
};

const removeReview = async (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};

module.exports = { addReview, getDoctorReviews, removeReview };
