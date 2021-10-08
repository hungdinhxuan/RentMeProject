const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controllers');
const passport = require('passport');

router.get('/', UserController.filterPlayers)

module.exports = router;