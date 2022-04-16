import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UserLoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(64)
    public username: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    public password: string;
}
