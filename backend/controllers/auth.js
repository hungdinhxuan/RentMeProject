const User = require('../models/users');
const argon2 = require('argon2');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(path.join(__dirname, '../private.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, '../public.pem'));
const { OAuth2Client } = require('google-auth-library');
const mailgun = require('../utils/mailgun');

class Auth {
  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      console.log(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'username or password is not correct',
        });
      }
      const verify = await argon2.verify(user.password, password);
      if (verify) {
        console.log(verify);
        const token = await jwt.sign({ sub: user._id }, privateKey, {
          algorithm: 'RS256',
          expiresIn: '24h',
        });
        return res.json({ success: true, message: 'Login succesful', token });
      }
      return res.status(401).json({
        success: false,
        message: 'username or password is not correct',
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
    let { username, email, password, fullName } = req.body;
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(406)
          .json({ success: false, message: 'username is used' });
      }
      user = await User.findOne({ email });
      if (user) {
        return res
          .status(406)
          .json({ success: false, message: 'email is used' });
      }
      password = await argon2.hash(req.body.password);
      user = await User.create({ username, email, fullName, password });
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

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    // const user = await User.findOne({ email: email });
    // if (!user) {
    //   return res.status(406).json({
    //     success: false,
    //     message: "This email hasn't registered yet",
    //   });
    // }
    const token = await jwt.sign({ sub: email }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2h',
    });
    const data = {
      from: process.env.MAILGUN_SENDER_MAIL,
      to: email,
      subject: 'Reset password link',
      // text: 'Test email text',
      html: `
      <div style="margin: auto; width: 20%; height: auto">
      <img
        src="https://rentme-project.s3.ap-east-1.amazonaws.com/1631865437047-player-dou-a.jpg"
      />
    </div>
    <br />
    <div style="text-align: center">
      <b>To reset your password, please visit the following page </b>
      <a
        href="${process.env.SERVER_URL}/api/auth/reset-password/?token=${token}"
        >${process.env.SERVER_URL}/api/auth/reset-password/?token=${token}</a
      >
    </div>
            `,
    };
    req.data = data;
    return mailgun(req, res);
  }

  resetPassword(req, res, next) {}

  async googleLogin(req, res, next) {
    const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);
    const { tokenId } = req.body;
    console.log(req.body);
    try {
      const response = await client.verifyIdToken({
        idToken: tokenId,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      const { sub, email_verified, name, email, picture } = response.payload;
      console.log(response.payload);
      if (email_verified) {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            username: `google_${sub}`,
            email,
            password: await argon2.hash(`${Math.random()}`),
            fullName: name,
            avatar: picture,
          });
        }
        const token = jwt.sign({ sub: user._id }, privateKey, {
          algorithm: 'RS256',
          expiresIn: '24h',
        });
        return res.json({
          success: true,
          message: 'Login successful',
          token,
        });
      }
      return res
        .status(403)
        .json({ success: true, message: 'Email is not verified' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error,
      });
    }
  }
  async facebookLogin(req, res, next) {
    const { accessToken } = req.body;
    let urlGraphFacebook = `https://graph.facebook.com/v12.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${accessToken}`;
    try {
      const response = await fetch(urlGraphFacebook, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      const { id, email, name, picture } = data;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          username: `facebook_${id}`,
          email: email || 'null',
          password: await argon2.hash(`${Math.random()}`),
          fullName: name,
          avatar: picture.data.url,
        });
      }
      const token = jwt.sign({ sub: user._id }, privateKey, {
        algorithm: 'RS256',
        expiresIn: '24h',
      });
      return res.json({
        success: true,
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error,
      });
    }
  }
}

module.exports = new Auth();
