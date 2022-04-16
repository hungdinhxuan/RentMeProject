import { Test, TestingModule } from '@nestjs/testing';
import { TradingsService } from './tradings.service';

describe('TradingsService', () => {
  let service: TradingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingsService],
    }).compile();

    service = module.get<TradingsService>(TradingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
