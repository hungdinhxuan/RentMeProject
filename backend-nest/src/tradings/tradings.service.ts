import { Injectable } from '@nestjs/common';
import { CreateTradingDto } from './dto/create-trading.dto';
import { UpdateTradingDto } from './dto/update-trading.dto';

@Injectable()
export class TradingsService {
  create(createTradingDto: CreateTradingDto) {
    return 'This action adds a new trading';
  }

  findAll() {
    return `This action returns all tradings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trading`;
  }

  update(id: number, updateTradingDto: UpdateTradingDto) {
    return `This action updates a #${id} trading`;
  }

  remove(id: number) {
    return `This action removes a #${id} trading`;
  }
}
