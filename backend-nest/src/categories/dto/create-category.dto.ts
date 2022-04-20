import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    public description: string;
}
