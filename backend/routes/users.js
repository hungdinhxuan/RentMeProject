const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const passport = require('passport')
const checkRoles = require('../middleware/checkRoles')
const s3 = require('../utils/s3')

router.get('/', passport.authenticate('jwt', { session: false }), UserController.getAll)
router.post('/upload', s3.uploadOneImage)
router.get('/files', s3.listAllObjects)
router.get('/:id', passport.authenticate('jwt', { session: false }), checkRoles.CustomerRole, UserController.getOne)


module.exports = router