import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class RegisterPlayerFormDto {
  @ApiProperty()
  @MaxLength(255)
  @IsNotEmpty()
  nickname: string;

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
  pricePerHour: number;

  @ApiProperty()
  games: Types.ObjectId[];
}
