import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, MaxLength, Min } from 'class-validator';


export class RegisterPlayerFormDto {
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
  
  @ApiProperty()
  
  services: Types.ObjectId[];
}
