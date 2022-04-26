import { Types } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/search.base';

export class SearchGameDto extends SearchBase {
  @ApiPropertyOptional()
  categories: Types.ObjectId [];

  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
