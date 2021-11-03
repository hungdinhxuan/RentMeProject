const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour window
  max: 10, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after 24 hour',
});


const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 10 requests
  message:
    'This ip is blocked in 1h because try to perform brute force is not allowed !!!!',
});

const followLimiter = rateLimit({
  windowMs: 1 * 60 *  1000, // 1 minute window
  max: 1, // start blocking after 1 requests
  message:
    'Please try again after 1p',
})



module.exports = {
  loginLimiter,
  registerLimiter,
  followLimiter,
};
