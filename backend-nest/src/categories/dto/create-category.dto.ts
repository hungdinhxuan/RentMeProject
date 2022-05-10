import { CreateBase } from '../../base/dto/create.base.dto';
import { Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto extends CreateBase {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({
        example: 'test'
    })
    public name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    @ApiProperty({
        example: 'test'
    })
    public description: string;

}
