const express = require('express');
const router = express.Router();
const ManagementController = require('../controllers/managements.controller');
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');

router.get(
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/users',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.getUsers,
);

router.post(
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/users',

  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.createUser,
);

router.patch(
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/users',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.restoreUsers,
);

router.delete(
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/users/soft',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.softDeleteUsers,
);

router.delete(
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  '/users/force',
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.forceDeleteUsers,
);

router.put(
  '/users',
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  ManagementController.updateUser,
);
module.exports = router;
