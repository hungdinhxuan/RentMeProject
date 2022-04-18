import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, MaxLength, Min } from 'class-validator';


export class RegisterPlayerDto {
  @ApiProperty()
  @MaxLength(255)
  @IsNotEmpty()
  
  shortDesc: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(1000)
  
  longDesc: string;

  @ApiProperty()
  @IsNotEmpty()
  
  userId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  
  coverBackground: string;

  @ApiProperty()
  @Min(0)
  
  pricePerHour: number;

  @ApiPropertyOptional()
  
  recordVoiceUrl?: string;

  @ApiProperty()
  
  albums: string[];

  @ApiPropertyOptional()
  
  timeCanReceive?: number[];
  
  @ApiProperty()
  
  services: Types.ObjectId[];
}
