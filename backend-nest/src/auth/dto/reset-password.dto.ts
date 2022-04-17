import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'string@gmail.com',
  })
  @MaxLength(255)
  public email: string;

  @IsNotEmpty()
  @IsString()
  public token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  public newPassword: string;
}
