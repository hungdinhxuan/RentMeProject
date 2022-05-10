import { Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { CreateBase } from '../../base/dto/create.base.dto';

export class CreateCommentDto extends CreateBase {

    @ApiProperty({
        example: 'Comment'
    })
    @IsNotEmpty()
    @MaxLength(3000)
    public content: string;

    @ApiProperty({
        example: Types.ObjectId.generate().toString()
    })
    @IsNotEmpty()
    public postId: string;

    @ApiProperty({
        example: Types.ObjectId.generate().toString()
    })
    @IsNotEmpty()
    public postUserId: string;
}
