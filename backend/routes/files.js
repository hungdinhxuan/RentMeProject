const express = require('express');
const router = express.Router();
const FilesController = require('../controllers/files.controllers')


router.post('/users', FilesController.insertUsersWithExcel)
router.get('/users', FilesController.downloadUsersExcel)


module.exports = router;
