import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto  {
    @ApiProperty()
    public content: string;
    @ApiProperty()
    public createdById: string;
    @ApiProperty()
    public createdBy : string;
}
