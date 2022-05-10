import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators';
import { SearchBase } from 'src/base/schema/search.base.schema';

export class SearchPostDto extends SearchBase {
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}