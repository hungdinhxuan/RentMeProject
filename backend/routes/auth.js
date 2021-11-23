const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const verifyRecaptcha = require('../middlewares/verifyReptcha');
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const {
  loginLimiter,
  registerLimiter,
} = require('../middlewares/limitRequests');
const checkValidAccount = require('../middlewares/checkValidAccount');

router.get(
      /*
        #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to get user info'
        #swagger.security = [{
            "Authorization": []
        }]
    */

  '/',
  passport.authenticate('jwt', { session: false }), // jsonwebtoken
  checkValidAccount,
  (req, res) => res.status(200).send(req.user),
);



if (process.env.NODE_ENV === 'production') {
  router.post(
     /*
        #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to login user'
        #swagger.security = [{
            "Authorization": []
        }]
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.',
                schema: {
                    username: 'rentme1',
                    password: 'Str0ng!Passw0rd',
                    captcha: 'google recaptcha'
                }
        }
    */
    '/login',
    verifyRecaptcha,
    validate.validateLogin(),
    validate.handleValidationErrors,
    // loginLimiter,
    authController.login,
  );
} else {
  router.post(
    /*  
        #swagger.tags = ['Auth']  
        #swagger.description = 'Endpoint to login user'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.',
                schema: {
                    username: 'rentme1',
                    password: 'Str0ng!Passw0rd',
                }
        } 
      */
    '/login',
    validate.validateLogin(),
    validate.handleValidationErrors,
    authController.login,
  );
}

router.post(
  '/google',
  /*  
        #swagger.tags = ['Auth'] 
        #swagger.description = 'Endpoint to login user with google account'
         */
  authController.googleLogin,
);
router.post(
  '/facebook',
  /*  
        #swagger.tags = ['Auth']  
        #swagger.description = 'Endpoint to login user with facebook account'
        */
  authController.facebookLogin,
);

router.post(
  /*  
        #swagger.tags = ['Auth']  
        #swagger.description = 'Endpoint to register user'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.',
                schema: {
                    username: 'rentme1234', 
                    email: 'rentme1244@rentme.games', 
                    password: 'Str0ng!Passw0rd', 
                    fullName: 'RentMe Games 1234',
                }
              }
   */
  '/register',
  validate.validateRegisterUser(),
  validate.handleValidationErrors,
  registerLimiter,
  authController.register,
);

router.patch(
  '/forgot-password',
  /*  
        #swagger.tags = ['Auth']  
        #swagger.description = 'Endpoint to forgot password'
        
*/
  authController.forgotPassword,
);
router.get(
  '/reset-password',
  /*  
        #swagger.tags = ['Auth']  
        #swagger.description = 'Endpoint to reset password'
         #swagger.parameters['obj'] = {
                in: 'params',
                description: 'token to reset password',
                schema: {
                    token: 'token'
                }
      }
        */
  authController.resetPassword,
);

module.exports = router;
