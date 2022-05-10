import { ApiProperty } from '@nestjs/swagger';
import {CreateBase} from '../../base/dto/create.base.dto';
export class CreatePostDto extends CreateBase {
    @ApiProperty({
        example: 'test'
    })
    public content: string;
}
