const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');
const passport = require('passport');

router.post(
    /*  
        #swagger.tags = ['Services']  
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/',
  passport.authenticate('jwt', { session: false }),
  servicesController.create,
);
router.get('/', 
  /*  
        #swagger.tags = ['Services']  
    */
servicesController.getAll);
router.get('/:id', 
  /*  
        #swagger.tags = ['Services']  
        #swagger.parameters['id'] = { description: 'Services ID' }
    */
servicesController.getOne);

module.exports = router;
