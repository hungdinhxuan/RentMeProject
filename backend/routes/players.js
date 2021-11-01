const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/players.controller');
const passport = require('passport');
const { followLimiter } = require('../middlewares/limitRequests');

router.get(
  '/',
  /*  
        #swagger.tags = ['Players']  
       
    */
  PlayerController.filterPlayers,
);
router.get(
  '/:id',
  /*  
        #swagger.tags = ['Players']  
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
  PlayerController.getOnePlayer,
);

router.get(
  '/:id/reviews',
  /*  
        #swagger.tags = ['Players']  
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
  PlayerController.getReviews,
);

router.post(
  '/:id/reviews',
  /*  
        #swagger.tags = ['Players']  
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
  passport.authenticate('jwt', { session: false }),
  PlayerController.createReview,
);

router.post(
  '/:id/donate',
  /*  
        #swagger.tags = ['Players']  
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
  passport.authenticate('jwt', { session: false }),
  PlayerController.donate,
);

router.patch(
  '/:id/follow',
  /*  
        #swagger.tags = ['Players']  
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['id'] = { description: 'Player ID' }

    */
  passport.authenticate('jwt', { session: false }),
  followLimiter,
  PlayerController.follow,
);

module.exports = router;
