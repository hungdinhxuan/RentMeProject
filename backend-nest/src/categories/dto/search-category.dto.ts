import { SearchBase } from '../../base/schema/search.base.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class SearchCategoryDto extends SearchBase {
  
  @ApiPropertyOptional({
    default: 'name',
  })
  sort?: string;
}
