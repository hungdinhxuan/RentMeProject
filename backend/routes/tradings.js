const express = require('express');
const router = express.Router();
const TradingsController = require('../controllers/tradings.controller');
const passport = require('passport');

router.post(
    /*  
        #swagger.tags = ['Tradings']  
    */
  '/auth',
  passport.authenticate('jwt', { session: false }),
  TradingsController.authRoom,
);


module.exports = router;
