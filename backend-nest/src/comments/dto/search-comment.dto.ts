import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/search.base';

export default class SearchCommentDto extends SearchBase {
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
