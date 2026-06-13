const { RateLimiterMemory } = require('rate-limit-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 120,
  duration: 60
});

module.exports = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }
};
