import { Test, TestingModule } from '@nestjs/testing';
import { TradingsController } from './tradings.controller';
import { TradingsService } from './tradings.service';

describe('TradingsController', () => {
  let controller: TradingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingsController],
      providers: [TradingsService],
    }).compile();

    controller = module.get<TradingsController>(TradingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
