import { Role } from 'src/users/enums/role';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchBase } from 'src/base/schema/search.base.schema';

export class SearchUserDto extends SearchBase {
  @ApiPropertyOptional({
      enum: [Role.ROOT, Role.ADMIN, Role.STREAMER, Role.PLAYER, Role.CUSTOMER]
  })
  role?: number;

  @ApiPropertyOptional({
    default: 'username',
  })
  sort?: string;
}
