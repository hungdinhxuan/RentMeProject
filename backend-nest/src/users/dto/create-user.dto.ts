import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role';
import {  IsEmail, IsNotEmpty, IsString, Max, MaxLength,  Min,  MinLength } from 'class-validator';
import { IsEmailAlreadyExist, IsUserAlreadyExist, IsValidRole } from '../user.validator';

export class CreateUserDto {
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
    @ApiProperty()
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
        default: Role.CUSTOMER
    })
    @IsValidRole({
        message: 'Role $value is not valid.',
    })
    public role: number;
}
