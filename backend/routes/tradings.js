const express = require('express');
const router = express.Router();
const TradingsController = require('../controllers/tradings.controllers');
const passport = require('passport');

router.post(
    /*  
        #swagger.tags = ['Tradings']  
    */
  '/',
  passport.authenticate('jwt', { session: false }),
  TradingsController.authRoom,
);

module.exports = router;
