import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {Types } from 'mongoose';
import SearchCommentDto from './dto/search-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createAsync(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.createAsync(createCommentDto);
  }

  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async searchPagedAsync(@Query() searchDto: SearchCommentDto) {
    return await this.commentsService.searchPagedAsync(searchDto);
  }

  @Get(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async findOneAsync(@Param('id') id: Types.ObjectId) {
    return await this.commentsService.findOneAsync({ _id: id });
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
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.updateAsync(id, updateCommentDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.commentsService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.commentsService.hardRemoveAsync(id);
  }
  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.commentsService.softRemoveAsync(id);
  }
}
