import { JwtAuthGuard } from './../auth/jwt/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types, PaginateResult } from 'mongoose';
import { User } from './schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './enums/role';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CUSTOMER)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  async searchPaged(
    @Query() searchUser: SearchUserDto,
  ): Promise<PaginateResult<User>> {
    return await this.usersService.searchPaged(searchUser);
  }

  @Get(':id')
  async findOneById(@Param('id') id: Types.ObjectId): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: Types.ObjectId): Promise<void> {
    await this.usersService.remove(id);
  }
}
