import { Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateGameDto {
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

    @ApiProperty()
    public categories : Types.ObjectId [];
}
