import { TypeAccount } from './../enums/type-account.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/role';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsEmailAlreadyExist,
  IsUserAlreadyExist,
  IsValidRole,
  IsValidTypeAccount,
} from '../user.validator';

import { CreateBase } from '../../base/dto/create.base.dto';

export class CreateUserDto  {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  @IsUserAlreadyExist({
    message: 'User $value already exists. Choose another name.',
  })
  public username: string;

  @IsEmail()
  @ApiProperty({
    example: 'string@gmail.com'
  })
  @MaxLength(255)
  @IsEmailAlreadyExist({
    message: 'Email $value already exists. Choose another email.',
  })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  public fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  @ApiProperty({
    name: 'role',
    default: Role.CUSTOMER,
    enum: [Role.ROOT, Role.ADMIN, Role.STREAMER, Role.PLAYER, Role.CUSTOMER],
  })
  @IsValidRole({
    message: 'Role $value is not valid.',
  })
  public role: Role;

  @ApiPropertyOptional({
      default: 'https://res.cloudinary.com/rentme-store/image/upload/v1633957597/rentme/default_avatar.png'
  })
  @IsString()
  @MaxLength(500)
  public avatar: string;

  @ApiPropertyOptional({
    default: TypeAccount.LOCAL,
    enum: [TypeAccount.LOCAL, TypeAccount.FACEBOOK, TypeAccount.GOOGLE]
  })
  @IsValidTypeAccount({
    message: 'Type account $value is not valid.',
  })
  public typeAccount: TypeAccount;
}
