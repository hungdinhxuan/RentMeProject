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

router.get(
  /*  
        #swagger.tags = ['Users']  
    */
  '/',
  // passport.authenticate('jwt', { session: false }),
  // AdminRole,
  UsersController.getAll,
);

router.post(
  /*  
        #swagger.tags = ['Users']  
        #swagger.security = [{
            "Authorization": []
        }]
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
        #swagger.parameters['id'] = { description: 'User ID' }
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
        #swagger.parameters['id'] = { description: 'User ID' }
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
        #swagger.parameters['id'] = { description: 'User ID' }
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
        #swagger.parameters['id'] = { description: 'User ID' }
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
        #swagger.parameters['id'] = { description: 'User ID' }
        #swagger.security = [{
            "Authorization": []
        }]
    */
passport.authenticate('jwt', { session: false }),
UsersController.getTransfers
)



module.exports = router;
