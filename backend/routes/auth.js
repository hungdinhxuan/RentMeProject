const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const verifyRecaptcha = require('../middleware/verifyReptcha');
const authController = require('../controllers/auth');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  res.send(req.user),
);

router.post(
  '/login',
  // verifyRecaptcha,
  validate.validateLogin(),
  validate.handleValidationErrors,
  authController.login,
);

router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);

router.post(
  '/register',
  validate.validateRegisterUser(),
  validate.handleValidationErrors,
  authController.register,
);

router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);

module.exports = router;
