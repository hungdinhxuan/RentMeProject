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

module.exports = router;