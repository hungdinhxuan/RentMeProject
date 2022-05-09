import { User } from './user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: User.name, useValue: jest.fn() }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find one should return object', async () => {
    const obj = {};
    const result = await service.findOne(obj);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(User);
  });

  
});
