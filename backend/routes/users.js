const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controllers');
const passport = require('passport');
const { AdminRole } = require('../middleware/checkRoles');
const {
  validateRegisterUser,
  validateNewPassword,
  handleValidationErrors,
} = require('../middleware/validate');

router.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  // AdminRole,
  UserController.getAll,
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  validateRegisterUser(),
  handleValidationErrors,
  UserController.createUser,
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.getOne,
);

router.patch(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  UserController.changeAvatar,
);

router.patch(
  '/:id/password',
  passport.authenticate('jwt', { session: false }),
  validateNewPassword(),
  handleValidationErrors,
  UserController.changePassword,
);

router.delete(
  '/:id/soft',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  UserController.softDelete,
);
module.exports = router;
