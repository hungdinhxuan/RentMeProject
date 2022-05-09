import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument, CategoryModel } from './category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';


describe('CategoriesService', () => {
  let service: CategoriesService;
  let model: CategoryModel<CategoryDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
