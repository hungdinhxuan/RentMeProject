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

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
            "Authorization": []
        }]
    */
  res.status(200).send(req.user),
);

if (process.env.NODE_ENV === 'production') {
  router.post(
    '/login',
    verifyRecaptcha,
    validate.validateLogin(),
    validate.handleValidationErrors,
    loginLimiter,
    authController.login,
  );
} else {
  router.post(
    /*  
        #swagger.tags = ['Auth']  
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.',
                schema: {
                    username: 'rentme1',
                    password: 'Str0ng!Passw0rd',
                }
        } */
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
         */
  authController.googleLogin,
);
router.post(
  '/facebook',
  /*  
        #swagger.tags = ['Auth']  
        */
  authController.facebookLogin,
);

router.post(
  /*  
        #swagger.tags = ['Auth']  
        
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
        
*/
  authController.forgotPassword,
);
router.get(
  '/reset-password',
  /*  
        #swagger.tags = ['Auth']  
        
*/
  authController.resetPassword,
);

module.exports = router;
