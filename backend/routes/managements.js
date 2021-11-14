const express = require('express');
const router = express.Router();
const passport = require('passport');
const { AdminRole } = require('../middlewares/checkRole');
const UsersManagement = require('../managements/users.management');
const PlayersManagement = require('../managements/players.management');
const StatisticManagement = require('../managements/statistics.management');
const PlayersController = require('../controllers/players.controller')

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

router.get(
  '/users/deleted',
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  UsersManagement.getDeletedUsers,
);

router.get('/players', 
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
        passport.authenticate('jwt', { session: false }),
        AdminRole,
        PlayersController.filterPlayers
)

router.get('/players/v1', 
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
        passport.authenticate('jwt', { session: false }),
        AdminRole,
        PlayersManagement.getPlayers,
)

router.get(
  '/players/banned',
  /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  PlayersManagement.getBannedPlayers,
);

router.get(
  '/statistics/profits',
    /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  StatisticManagement.profitsBasedOnIntervalTime,
);

router.get(
  '/statistics/summary',
    /*  
        #swagger.tags = ['Managements']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  StatisticManagement.summary,
);
module.exports = router;
