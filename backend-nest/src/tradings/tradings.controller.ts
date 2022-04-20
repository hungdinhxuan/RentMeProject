import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TradingsService } from './tradings.service';
import { CreateTradingDto } from './dto/create-trading.dto';
import { UpdateTradingDto } from './dto/update-trading.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tradings')
@Controller('tradings')
export class TradingsController {
  constructor(private readonly tradingsService: TradingsService) {}

  @Post()
  create(@Body() createTradingDto: CreateTradingDto) {
    return this.tradingsService.create(createTradingDto);
  }

  @Get()
  findAll() {
    return this.tradingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTradingDto: UpdateTradingDto) {
    return this.tradingsService.update(+id, updateTradingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradingsService.remove(+id);
  }
}
