import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    // You can throw an exception based on either "info" or "err" arguments
  
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid Token!');
    }

    return super.handleRequest(err, user, info, context);
  }
}
