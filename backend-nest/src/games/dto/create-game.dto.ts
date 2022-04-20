import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    public description: string;
}
