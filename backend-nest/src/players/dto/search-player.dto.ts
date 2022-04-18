import { SearchBase } from './../../base/search.base';
import { Gender } from './../../users/enums/gender.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPlayerDto extends SearchBase {
  @ApiPropertyOptional({
    enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
  })
  gender?: string;
  @ApiPropertyOptional()
  minPrice?: number;
  @ApiPropertyOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  minAge?: number = 18;
  @ApiPropertyOptional()
  maxAge?: number = 70;
  @ApiPropertyOptional({})
  sort?: string;
}
