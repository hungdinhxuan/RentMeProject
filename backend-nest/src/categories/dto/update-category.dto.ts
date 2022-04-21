import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    public description: string;
}
