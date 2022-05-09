import { SearchBase } from '../../base/search.base';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class SearchCategoryDto extends SearchBase {
  
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
