const express = require('express');
const router = express.Router();
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');
const UsersManagement = require('../managements/users.management')
const PlayersManagement = require('../managements/players.management')

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
  UsersManagement.getUsers,
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
  UsersManagement.createUser,
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
  UsersManagement.restoreUsers,
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
  UsersManagement.softDeleteUsers,
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
  UsersManagement.forceDeleteUsers,
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
  UsersManagement.updateUser,
);


router.get('/players/banned', 
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  PlayersManagement.getBannedPlayers
)
module.exports = router;
