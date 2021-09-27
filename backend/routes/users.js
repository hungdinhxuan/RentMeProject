const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const passport = require('passport')
const checkRoles = require('../middleware/checkRoles')


router.get('/', passport.authenticate('jwt', { session: false }), UserController.getAll)
router.get('/:id', passport.authenticate('jwt', { session: false }), checkRoles.CustomerRole, UserController.getOne)


module.exports = router