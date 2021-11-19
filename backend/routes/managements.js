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
        #swagger.description = 'Endpoint to get all users'
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
        #swagger.description = 'Endpoint to get create users with specific role'
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/CreateUser" }
        }
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
        #swagger.description = 'Endpoint to restore delete users'
        #swagger.parameters['obj'] =  {
            in: 'body',
            description: 'UserId array',
            required: true,
            schema: {
              ids: ['abc', 'xyz']
            }
        }
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
        #swagger.description = 'Endpoint to update user info'
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['obj'] =  {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { 
              _id: "", 
              fullName: "", 
              username: "", 
              email: "", 
              password: "", 
              province: "", 
              role: 3
            }
        }
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  UsersManagement.updateUser,
);

router.delete(
  /*  
        #swagger.tags = ['Managements']
        #swagger.description = 'Endpoint to soft delete users'
        #swagger.parameters['obj'] =  {
            in: 'body',
            description: 'UserId array',
            required: true,
            schema: {
              ids: ['abc', 'xyz']
            }
        }
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
        #swagger.description = 'Endpoint to force delete users'
        #swagger.parameters['obj'] =  {
            in: 'body',
            description: 'UserId array',
            required: true,
            schema: {
              ids: ['abc', 'xyz']
            }
        }
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
        #swagger.description = 'Endpoint to get delete users'
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
        #swagger.description = 'Endpoint to filter players'
        #swagger.security = [{
            "Authorization": []
        }]
    */
        passport.authenticate('jwt', { session: false }),
        AdminRole,
        PlayersController.filterPlayers
)

router.put('/players/:id', 
  /*  
        #swagger.tags = ['Managements']
        #swagger.description = 'Endpoint to update player information'
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['id'] = { description: 'Player ID' }
    */
        passport.authenticate('jwt', { session: false }),
        AdminRole,
        PlayersManagement.updatePlayer
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
        #swagger.description = 'Endpoint to get banned players information'
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
  AdminRole,
  PlayersManagement.getBannedPlayers,
);


router.delete('/players', 
/*  
        #swagger.tags = ['Managements']
        #swagger.description = 'Endpoint to get ban players'
        #swagger.security = [{
            "Authorization": []
        }]
    */
  passport.authenticate('jwt', { session: false }),
   AdminRole,
  PlayersManagement.changeStatusPlayers
)

router.get(
  '/statistics/profits',
    /*  
        #swagger.tags = ['Managements']
        #swagger.description = 'Endpoint to calculate profits of rentme'
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
