import { Module } from '@nestjs/common';
import { TradingsService } from './tradings.service';
import { TradingsController } from './tradings.controller';

@Module({
  controllers: [TradingsController],
  providers: [TradingsService]
})
export class TradingsModule {}
