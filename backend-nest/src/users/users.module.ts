import { UsersGateway } from './users.gateway';
import {
  IsEmailAlreadyExistConstraint,
  IsUserAlreadyExistConstraint,
  IsValidRoleConstraint,
  IsValidTypeAccountConstraint,
} from './user.validator';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    IsEmailAlreadyExistConstraint,
    IsUserAlreadyExistConstraint,
    IsValidRoleConstraint,
    IsValidTypeAccountConstraint,
    UsersService,
    UsersGateway
  ],
  exports: [UsersService],
})
export class UsersModule {}
