const express = require('express');
const router = express.Router();
const TradingsController = require('../controllers/tradings.controller');
const passport = require('passport');

router.post(
    /*  
        #swagger.tags = ['Tradings']  
        #swagger.description = 'Endpoint to auth user when access chat room'
        #swagger.security = [{
            "Authorization": []
        }]
    */
   
  '/auth',
  passport.authenticate('jwt', { session: false }),
  TradingsController.authRoom,
);


module.exports = router;
