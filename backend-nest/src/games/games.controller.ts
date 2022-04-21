import { SearchGameDto } from './dto/search-game.dto';
import { ApiTags } from '@nestjs/swagger';
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
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Types } from 'mongoose';

@ApiTags('games')
@Controller('api/v1/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async createAsync(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.createAsync(createGameDto);
  }

  @Get('search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async searchPagedAsync(@Query() searchDto: SearchGameDto) {
    return await this.gamesService.searchPagedAsync(searchDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async findOneAsync(@Param('id') id: Types.ObjectId) {
    return await this.gamesService.findOneAsync({ _id: id });
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
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return await this.gamesService.updateAsync(id, updateGameDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.gamesService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.gamesService.hardRemoveAsync(id);
  }
  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.gamesService.softRemoveAsync(id);
  }
}
