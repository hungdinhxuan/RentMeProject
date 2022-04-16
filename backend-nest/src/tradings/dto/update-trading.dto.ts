import { PartialType } from '@nestjs/swagger';
import { CreateTradingDto } from './create-trading.dto';

export class UpdateTradingDto extends PartialType(CreateTradingDto) {}
