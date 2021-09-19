const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services')

router.get('/', servicesController.getAll)
router.get('/:id', servicesController.getOne)

module.exports = router;