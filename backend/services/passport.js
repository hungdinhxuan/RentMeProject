const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const publicKey = fs.readFileSync(path.join(__dirname, '../public.pem'));
const User = require('../models/users.models');

module.exports = () => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = publicKey;
  opts.algorithm = ['RS256'];
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.sub).select('-password ');
        if (user) {
          //   console.log(user);
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      } catch (error) {
        return done(error, false);
      }
    }),
  );
};
