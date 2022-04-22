import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from '../enums/role';
import { IsValidRole } from '../user.validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
  @ApiPropertyOptional()
  @IsNotEmpty()
  @MaxLength(255)
  public fullName: string;

  @ApiPropertyOptional({
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
}
