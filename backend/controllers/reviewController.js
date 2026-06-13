const { addReview, getDoctorReviews, removeReview } = require('../services/reviewService');

const createReview = async (req, res, next) => {
  try {
    const review = await addReview({
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      rating: req.body.rating,
      comment: req.body.comment,
      appointmentId: req.body.appointmentId
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const listReviews = async (req, res, next) => {
  try {
    const reviews = await getDoctorReviews(req.query.doctorId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await removeReview(req.params.id);
    res.json(review);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, listReviews, deleteReview };
