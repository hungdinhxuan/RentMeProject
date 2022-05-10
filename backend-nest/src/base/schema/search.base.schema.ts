import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class SearchBase {
  @ApiProperty({
    default: 1,
  })
  page: number = 1;
  @ApiProperty({
    default: 20,
  })
  limit: number = 20;
  @ApiPropertyOptional()
  keyword?: string;

  @ApiPropertyOptional({
    default: 'asc',
    enum: ['asc', 'desc'],
  })
  order?: string;
}
