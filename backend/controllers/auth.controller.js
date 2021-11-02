const User = require('../models/users.model');
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
      // console.log(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'username or password is not correct',
        });
      }
      const verify = await argon2.verify(user.password, password);
      if (verify) {
        // console.log(verify);
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
    
    
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This email hasn't registered yet",
      });
    }
    let randPassword = Array(10)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    randPassword = randPassword + '3aA@';
    const token = await jwt.sign(
      { sub: email, newPassword: randPassword },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '2h',
      },
    );
    const data = {
      from: process.env.MAILGUN_SENDER_MAIL,
      to: email,
      subject: 'Reset password link',
      // text: 'Test email text',
      html: `
      
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="${process.env.SERVER_URL}" title="logo" target="_blank">
                            <img width="60" src="https://rentme-project.s3.ap-east-1.amazonaws.com/1631865437047-player-dou-a.jpg" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <b>Your new password is ${randPassword}</b> <br/>
                                        <a href="${process.env.SERVER_URL}/api/auth/reset-password/?token=${token}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>rentme.games</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
            `,
    };
    req.data = data;
    return mailgun(req, res);
  }

  resetPassword(req, res, next) {
    const token = req.params.token;
    jwt.verify(token, publicKey, async function(err, decoded) {
      if(err){
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error'
        })
      }
      let {sub, newPassword} = decoded;
      try {
        newPassword = await argon2.hash(newPassword)
        const user = await User.findByIdAndUpdate(sub, {password: newPassword})
        return res.json({ success: true, message: 'Password reset successful'})
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error'
        })
      }
    });
  }

  async googleLogin(req, res, next) {
    const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);
    const { tokenId } = req.body;
    
    try {
      const response = await client.verifyIdToken({
        idToken: tokenId,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      const { sub, email_verified, name, email, picture } = response.payload;
    
      if (email_verified) {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            username: `google_${sub}`,
            email,
            password: await argon2.hash(`${Math.random()}`),
            fullName: name,
            avatar: picture,
            typeAccount: 'google'
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
      // console.log(error);
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
      // console.log(data);
      const { id, email, name, picture } = data;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          username: `facebook_${id}`,
          email: email || 'null',
          password: await argon2.hash(`${Math.random()}`),
          fullName: name,
          avatar: picture.data.url,
          typeAccount: 'facebook'
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
