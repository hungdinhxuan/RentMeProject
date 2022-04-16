import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from 'src/config/configuration';
import { JwtPayload } from './jwt-payload.interface';
import { validatedUser } from '../dto/validated-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getPublicKey(),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<validatedUser> {
    const user: validatedUser = {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      roleString: payload.roleString,
    }
    return user;
  }
}
