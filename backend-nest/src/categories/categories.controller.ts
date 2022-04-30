import { Query } from '@nestjs/common';
import { SearchCategoryDto } from './dto/search-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createAsync(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createAsync(createCategoryDto);
  }

  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async searchPagedAsync(@Query() searchDto: SearchCategoryDto) {
    return await this.categoriesService.searchPagedAsync(searchDto);
  }

  @Get(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async findOneAsync(@Param('id') id: Types.ObjectId) {
    return await this.categoriesService.findOneAsync({ _id: id });
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async updateAsync(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateAsync(id, updateCategoryDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.categoriesService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.categoriesService.hardRemoveAsync(id);
  }
  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.categoriesService.softRemoveAsync(id);
  }
}
