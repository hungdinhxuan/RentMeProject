import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/schema/search.base.schema';

export default class SearchCommentDto extends SearchBase {
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
