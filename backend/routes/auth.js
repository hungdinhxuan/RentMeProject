const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const users = require('../models/users')
const authController = require('../controllers/auth')

router.post('/login', validate.validateLogin(), validate.handleValidationErrors, (req, res) => {
 
  return res.send('ok');
});

router.post('/register', validate.validateRegisterUser(), validate.handleValidationErrors, (req, res) => {
  
  return res.send('Ok');
});

router.post('/reset-password')
module.exports = router;
