import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';
import { SearchBase } from 'src/base/search.base';

export class SearchPostDto extends SearchBase {
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
