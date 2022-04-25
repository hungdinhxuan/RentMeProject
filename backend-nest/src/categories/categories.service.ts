import { SearchCategoryDto } from './dto/search-category.dto';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument, CategoryModel } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: CategoryModel<CategoryDocument>,
  ) {}
  async createAsync(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async searchPagedAsync(
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

  async findOneAsync(obj: object) {
    return await this.categoryModel.findOne(obj);
  }

  async updateAsync(id: Types.ObjectId, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.categoryModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
