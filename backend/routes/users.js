const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const MessagesController = require('../controllers/messages.controlller');
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');
const {
  validateRegisterUser,
  validateNewPassword,
  handleValidationErrors,
  validateNewUserInfo,
} = require('../middlewares/validate');
const MessagesControlllers = require('../controllers/messages.controlller');



router.post(
  /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to register a specific user with specific role (ADMIN ONLY)'
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/CreateUser" }
        }
    */
  '/',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  validateRegisterUser(),
  handleValidationErrors,
  UsersController.createUser,
);

router.get(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to get one users with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id',
  passport.authenticate('jwt', { session: false }),
  UsersController.getOne,
);

router.put(
  /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to update user info with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/UpdateUserInfo" }
        }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validateNewUserInfo(),
  handleValidationErrors,
  UsersController.changeUserInfo,
);

router.post(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to perform transaction (deposit or withdraw money)'
        #swagger.parameters['id'] = { description: 'User ID' }
         #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/PerformTransaction" }
        }
        #swagger.security = [{
            "Authorization": []
        }]

    */
  '/:id/transactions',
  passport.authenticate('jwt', { session: false }),
  UsersController.transact,
);

router.get(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to get transactions of user with  with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/transactions',
  passport.authenticate('jwt', { session: false }),
  UsersController.getUserTransactions,
);

router.patch(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to update avatar of user with  with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['image'] = {
              in: 'formData',
              type: 'file',
              required: 'true',
        }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  UsersController.changeAvatar,
);

router.patch(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to change password of user with  with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.parameters['obj'] = {
          in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/UpdatePassword" }
        }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/password',
  passport.authenticate('jwt', { session: false }),
  validateNewPassword(),
  handleValidationErrors,
  UsersController.changePassword,
);

router.delete(
  /*  
        #swagger.tags = ['Users']  
        #swagger.description = 'Endpoint to perform soft delete user (move user to bin) with  with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/soft',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  UsersController.softDelete,
);

router.get(
  /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to get all notifications with  with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/messages',
  passport.authenticate('jwt', { session: false }),
  MessagesController.getAllMsg,
);

router.patch(
   /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to perform mark message as read of user with specific id as well message with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.parameters['msgId'] = { description: 'Message ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/messages/:msgId',
  passport.authenticate('jwt', { session: false }),
  MessagesControlllers.readMsg,
);

router.delete(
   /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to perform delete a notification of user with with specific id as well message with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.parameters['msgId'] = { description: 'Message ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
 '/:id/messages/:msgId' ,
 passport.authenticate('jwt', { session: false }),
 MessagesControlllers.deleteById,
)


router.delete(
     /*  
        #swagger.tags = ['Users'] 
        #swagger.description = 'Endpoint to perform delete all notifications of user with with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/:id/messages', 
passport.authenticate('jwt', { session: false })
)

router.get('/:id/transfers', 
   /*  
        #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to get all transfers of user with with specific id'
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
passport.authenticate('jwt', { session: false }),
UsersController.getTransfers
)



module.exports = router;
