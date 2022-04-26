import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import {Types} from 'mongoose';

export class UpdateGameDto extends PartialType(CreateGameDto) {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    @ApiProperty()
    public description: string;

    @ApiPropertyOptional()
    public categories : Types.ObjectId [];
}
