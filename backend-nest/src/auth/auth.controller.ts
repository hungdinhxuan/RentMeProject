import { RedisService } from './../redis.service';
import { UsersService } from './../users/users.service';
import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  Patch,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/enums/role';
import { UserLoginDto } from './dto/user-login.dto';
import { OAuth2Client } from 'google-auth-library';
import { TypeAccount } from 'src/users/enums/type-account.enum';
import { ConfigService } from '@nestjs/config';
import { SendgridService } from 'src/sendgrid.service';
import { ApiQuery } from '@nestjs/swagger';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly sendgridService: SendgridService,
    private readonly redisService: RedisService,
  ) {}
  @Post('login')
  async login(@Body() userLoginRequest: UserLoginDto, @Response() res) {
    const validateUser = await this.authService.validateUser(
      userLoginRequest.username,
      userLoginRequest.password,
    );
    if (validateUser === null) {
      return res.status(400).json({
        message: 'Username or password is incorrect',
      });
    }
    return res.status(200).json(this.authService.login(validateUser));
  }

  @Post('register')
  async register(@Body() userRegisterRequest: CreateUserDto) {
    userRegisterRequest.role = Role.CUSTOMER;
    return this.authService.register(userRegisterRequest);
  }

  @Post('google')
  async googleLogin(@Request() req, @Response() res) {
    const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);
    const { tokenId } = req.body;
    try {
      const response: any = await client.verifyIdToken({
        idToken: tokenId,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      const { sub, email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        let user = await this.usersService.findOne({ email });
        if (!user) {
          user = await this.usersService.create({
            username: `google_${sub}`,
            email,
            password: `${Math.random()}`,
            fullName: name,
            avatar: picture,
            typeAccount: TypeAccount.GOOGLE,
            role: Role.CUSTOMER,
          });
        }
        return res.status(HttpStatus.OK).json(this.authService.login(user));
      } else {
        throw new BadRequestException('Email is not verified');
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: auth.controller.ts ~ line 38 ~ AuthController ~ googleLogin ~ error',
        error,
      );
    }
  }
  @Post('facebook')
  async facebookLogin(@Request() req, @Response() res) {
    const { accessToken } = req.body;
    let urlGraphFacebook = `https://graph.facebook.com/v12.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${accessToken}`;
    try {
      const response = await fetch(urlGraphFacebook, {
        method: 'GET',
      });
      const data = await response.json();
      const { id, email, name, picture } = data;
      let user = await this.usersService.findOne({ email });
      if (!user) {
        user = await this.usersService.create({
          username: `facebook_${id}`,
          email,
          password: `${Math.random()}`,
          fullName: name,
          avatar: picture.data.url,
          typeAccount: TypeAccount.FACEBOOK,
          role: Role.CUSTOMER,
        });
      }
      return res.status(HttpStatus.OK).json(this.authService.login(user));
    } catch (error) {
      console.log(
        '🚀 ~ file: auth.controller.ts ~ line 79 ~ AuthController ~ facebookLogin ~ error',
        error,
      );
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Request() req) {
    const { email } = req.body;
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new BadRequestException("This email hasn't registered yet");
    }
    let randPassword = Array(10)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    const token = await this.authService.generateToken({
      sub: email,
      newPassword: randPassword,
    });
    const mail = {
      from: this.configService.get<string>('SEND_GRID_EMAIL_SENDER'),
      to: email,
      subject: 'Reset password link',
      // text: 'Test email text',
      html: `
        
  <!doctype html>
  <html lang="en-US">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email">
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
                            <a href="${this.configService.get<string>(
                              'SERVER_URL',
                            )}" title="logo" target="_blank">
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
                                              following link.
                                          </p>
                                          <b>Your new password is ${randPassword}</b> <br/>
                                          <a href="${this.configService.get<string>(
                                            'SERVER_URL',
                                          )}/api/auth/reset-password/?token=${token}"
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
    return await this.sendgridService.send(mail);
  }

  @ApiQuery({
    name: 'token',
  })
  @Patch('reset-password')
  async resetPassword(@Request() req, @Response() res) {
    const { token } = req.query;
    const result = await this.authService.resetPassword(token);
    if (!result) {
      throw new BadRequestException('Invalid token');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Password reset successfully',
    });
  }
}
