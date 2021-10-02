const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');
const passport = require('passport');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  servicesController.create,
);
router.get('/', servicesController.getAll);
router.get('/:id', servicesController.getOne);

module.exports = router;
