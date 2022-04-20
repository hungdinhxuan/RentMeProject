import { SearchCategoryDto } from './dto/search-category.dto';
import { Category } from './entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDocument, CategoryModel } from './schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult } from 'mongoose';
import {Types} from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: CategoryModel<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async searchPaged(
    searchCategory: SearchCategoryDto,
  ): Promise<PaginateResult<Category>> {
    console.log(searchCategory);

    return await this.categoryModel.paginate(
      {
        $or: [{ name: { $regex: searchCategory.keyword || '' } }],
      },
      {
        page: searchCategory.page,
        limit: searchCategory.limit,
        sort: { [searchCategory.sort]: searchCategory.order },
        lean: true,
        allowDiskUse: true,
      },
    );
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  softRemove(id: Types.ObjectId) {
    return `This action removes a #${id} category`;
  }

  hardRemove(id: Types.ObjectId) {
    return `This action removes a #${id} category`;
  }

  restore(id: Types.ObjectId) {
    return `This action restores a #${id} category`;
  }
}
