import { SendgridService } from './../sendgrid.service';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import config from 'src/config/configuration';

@Module({
  imports: [UsersModule,  PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const options: JwtModuleOptions = {
          privateKey: config.getPrivateKey(),
          publicKey: config.getPublicKey(),
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
            algorithm: 'RS256',
          },
          
        };
        return options; 
      }
    }),
  ],
  providers: [AuthService, JwtStrategy, SendgridService],
  exports: [AuthService, PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
