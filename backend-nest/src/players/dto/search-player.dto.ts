import { SearchBase } from '../../base/schema/search.base.schema';
import { Gender } from './../../users/enums/gender.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPlayerDto extends SearchBase {
  @ApiPropertyOptional({
    enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
  })
  gender?: string;
  @ApiPropertyOptional({
    default: 1
  })
  minPrice?: number = 1;
  @ApiPropertyOptional({
    default: 1000
  })
  maxPrice?: number = 1000;

  @ApiPropertyOptional()
  minAge?: number = 18;
  @ApiPropertyOptional()
  maxAge?: number = 70;
  @ApiPropertyOptional({
    default: 'nickname'
  })
  sort?: string;
}
