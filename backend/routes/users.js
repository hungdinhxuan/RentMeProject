const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controllers');
const passport = require('passport');
const { AdminRole } = require('../middleware/checkRoles');
const {
  validateRegisterUser,
  validateNewPassword,
  handleValidationErrors,
  validateNewUserInfo,
} = require('../middleware/validate');

router.get(
  /*  
        #swagger.tags = ['Users']  
    */
  '/',
  // passport.authenticate('jwt', { session: false }),
  // AdminRole,
  UserController.getAll,
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
  UserController.createUser,
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
  UserController.getOne,
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
  UserController.changeUserInfo,
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
  UserController.transact,
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
  UserController.getUserTransactions,
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
  UserController.changeAvatar,
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
  UserController.changePassword,
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
  UserController.softDelete,
);
module.exports = router;
