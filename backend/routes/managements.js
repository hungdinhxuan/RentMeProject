const express = require('express');
const router = express.Router();
const ManagementController = require('../controllers/managements.controller');
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.getUsers,
);

router.post(
  '/users',

  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.createUser,
);

module.exports = router;
