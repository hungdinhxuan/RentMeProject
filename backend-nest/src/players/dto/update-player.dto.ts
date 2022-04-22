import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';
import {  ApiPropertyOptional } from '@nestjs/swagger';
import { RegisterPlayerDto } from './register-player.dto';

export class UpdatePlayerDto extends PartialType(RegisterPlayerDto) {
    @ApiPropertyOptional()
    nickname: string;
    
    @ApiPropertyOptional()
    shortDesc: string;
    
    @ApiPropertyOptional()
    longDesc: string;
    
    @ApiPropertyOptional()
    pricePerHour: number;
    
    @ApiPropertyOptional()
    recordVoiceUrl: string;
    
    @ApiPropertyOptional()
    albums: string[];
    
    @ApiPropertyOptional()
    timeCanReceive: number[];
    
    @ApiPropertyOptional()
    games: Types.ObjectId[];
}
