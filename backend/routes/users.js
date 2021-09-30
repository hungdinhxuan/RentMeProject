const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const passport = require('passport');
const checkRoles = require('../middleware/checkRoles');
const {validateNewPassword, handleValidationErrors} = require('../middleware/validate')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  UserController.getAll,
);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles.CustomerRole,
  UserController.getOne,
);


router.patch(
  '/:id/change-password',
  passport.authenticate('jwt', { session: false }),
  validateNewPassword(),
  handleValidationErrors,
  UserController.changePassword
);
module.exports = router;
