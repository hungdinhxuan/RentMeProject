const User = require('../models/users');
const argon2 = require('argon2');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(path.join(__dirname, '../private.pem'));

class Auth {
  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      console.log(username);
      if (!user) {
        return res
          .status(401)
          .json({
            success: false,
            message: 'username or password is not correct',
          });
      }
      if (argon2.verify(user.password, password)) {
        const token = await jwt.sign(
          { sub: user._id }, privateKey,
          { algorithm: 'RS256', expiresIn: '24h' },
        );
        return res.json({ success: true, message: 'Login succesful', token });
      }
      return res
        .status(401)
        .json({
          success: false,
          message: 'username or password is not correct',
          user,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
  async register(req, res, next) {
    let {username, email, password, fullName} = req.body
    try {
      let user = await User.findOne({username})
      if(user){
          return res.status(406).json({success: false, message: 'username is used'})
      }
      user = await User.findOne({email})
      if(user){
        return res.status(406).json({success: false, message: 'email is used'})
      }
      password = await argon2.hash(req.body.password)
      user = await User.create({username, email, fullName, password})
      return res.status(201).json({
        success: true,
        message: 'created successful !!',
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
  resetPassword(req, res, next) {}
}

module.exports = new Auth();
