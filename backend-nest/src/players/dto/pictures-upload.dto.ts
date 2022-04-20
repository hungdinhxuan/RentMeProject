import { ApiProperty } from "@nestjs/swagger";

export class PicturesUploadDto {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    file: any[];
}