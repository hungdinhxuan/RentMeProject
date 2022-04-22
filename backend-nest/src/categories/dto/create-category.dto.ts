import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
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
}
