const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');

router.post(
    /*  
        #swagger.tags = ['Services']  
        #swagger.description = 'Endpoint to create service (ADMIN ONLY)'
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  servicesController.create,
);
router.get('/', 
  /*  
        #swagger.tags = ['Services']
        #swagger.description = 'Endpoint to get all services'
    */
servicesController.getAll);
router.get('/:id', 
  /*  
        #swagger.tags = ['Services']  
        #swagger.description = 'Endpoint to get a service'
        #swagger.parameters['id'] = { description: 'Services ID' }
    */
servicesController.getOne);

module.exports = router;
