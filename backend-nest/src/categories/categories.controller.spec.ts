import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            create: jest.fn<Promise<Category & any>, [CreateCategoryDto]>(),
          },
        },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  it('should create category', async () => {
    const category = {
      name: 'test',
      description: 'test',
      image: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await categoriesController.createAsync(category);
    expect(result).not.toBeNull();
  });
});
