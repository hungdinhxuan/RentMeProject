import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsValidRole } from "../user.validator";

export class SearchUserDto {
    @ApiProperty({
        default: 1,
    })
    page: number = 1;
    @ApiProperty({
        default: 20,
    })
    limit: number = 20;
    @ApiPropertyOptional()
    keyword?: string;
    
    @ApiPropertyOptional()
    role?: number;
}