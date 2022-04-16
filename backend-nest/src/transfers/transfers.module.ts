import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService]
})
export class TransfersModule {}
