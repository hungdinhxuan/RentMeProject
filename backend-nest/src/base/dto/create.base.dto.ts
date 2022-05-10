import { Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBase {
    @ApiProperty({
        example: Types.ObjectId.generate().toString()
    })
    @IsNotEmpty()
    public createdById: string;

    @ApiProperty({
        example: 'admin'
    })
    @IsNotEmpty()
    public createdBy: string;
}