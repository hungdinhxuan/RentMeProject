import { Types } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/search.base';

export class SearchGameDto extends SearchBase {
  @ApiPropertyOptional()
  categoryId: Types.ObjectId;

  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
