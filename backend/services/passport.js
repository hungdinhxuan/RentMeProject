const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const publicKey = fs.readFileSync(path.join(__dirname, '../public.pem'));
const users = require('../models/users');

module.exports = () => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = publicKey;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      users.findOne({ _id: jwt_payload.sub }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
        //   console.log(user);
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    }),
  );
};
