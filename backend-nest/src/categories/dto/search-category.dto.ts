import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/search.base';

export class SearchCategoryDto extends SearchBase {
  
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
