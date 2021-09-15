const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const users = require('../models/users');
const authController = require('../controllers/auth');

router.post(
  '/login',
  validate.validateLogin(),
  validate.handleValidationErrors,
  authController.login,
);

router.post(
  '/register',
  validate.validateRegisterUser(),
  validate.handleValidationErrors,
  authController.register,
);

router.post('/reset-password');
module.exports = router;
