import { Status } from './../users/enums/status.enum';
import BcryptHelper from 'src/utils/bcrypt.util';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/enums/role';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });

    if (user && (await BcryptHelper.comparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
      roleString: `${Role[user.role]}`,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      return null;
    }
  }

  generateToken(payload: object) {
    return this.jwtService.sign(payload);
  }

  async register(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  async resetPassword(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      let {sub, newPassword} = decoded;
      const user: any = await this.usersService.findOne({ _id: decoded.sub });
      if (!user.deleted || user.status !== Status.BANNED) {
        await this.usersService.updatePassword(user._id, newPassword);
        return {
          message: 'Password reset successfully',
        };
      }
      return null;
    } catch (error) {
     
      return null;
    }
  }
}
