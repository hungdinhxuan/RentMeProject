const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controllers');
const passport = require('passport');

router.get('/', UserController.filterPlayers)
router.get('/:id', UserController.getOnePlayer)

module.exports = router;