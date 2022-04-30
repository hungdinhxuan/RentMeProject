import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import {Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createAsync(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.createAsync(createPostDto);
  }

  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async searchPagedAsync(@Query() searchDto: SearchPostDto) {
    return await this.postsService.searchPagedAsync(searchDto);
  }

  @Get(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async findOneAsync(@Param('id') id: Types.ObjectId) {
    return await this.postsService.findOneAsync({ _id: id });
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
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updateAsync(id, updatePostDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.postsService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.postsService.hardRemoveAsync(id);
  }
  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.postsService.softRemoveAsync(id);
  }
}
