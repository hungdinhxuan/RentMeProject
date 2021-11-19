const express = require('express');
const router = express.Router();
const ConversationsController = require('../controllers/conversations.controller');
const passport = require('passport');


router.get('/others', 
/*  
        #swagger.tags = ['Conversations'] 
        #swagger.description = 'Endpoint to get recent contact'
        #swagger.security = [{
            "Authorization": []
        }]
    */
    passport.authenticate('jwt', { session: false }),
    ConversationsController.getOthersInConversation
)

router.get(
    /*  
        #swagger.tags = ['Conversations']
        #swagger.description = 'Endpoint to get all message of user with specific id'
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  ConversationsController.getAllWithUserId,
);

router.post('/:userId', 
    /*  
        #swagger.tags = ['Conversations']  
        #swagger.description = 'Endpoint to send a message of user with specific id'
        #swagger.security = [{
            "Authorization": []
        }]
    */
passport.authenticate('jwt', { session: false }),
ConversationsController.sendMessage
)   


module.exports = router;
