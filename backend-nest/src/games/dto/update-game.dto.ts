import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateGameDto extends PartialType(CreateGameDto) {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    public description: string;
}
