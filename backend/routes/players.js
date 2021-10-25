const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/players.controllers');
const passport = require('passport');

router.get('/', 
  /*  
        #swagger.tags = ['Players']  
       
    */
PlayerController.filterPlayers)
router.get('/:id', 
  /*  
        #swagger.tags = ['Players']  
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
PlayerController.getOnePlayer)

router.get('/:id/reviews', 
  /*  
        #swagger.tags = ['Players']  
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
PlayerController.getReviews)

router.post('/:id/reviews', 
  /*  
        #swagger.tags = ['Players']  
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
passport.authenticate('jwt', {session: false}),
PlayerController.createReview)

module.exports = router;