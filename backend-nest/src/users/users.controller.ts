import { SearchUserDto } from './dto/search-user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types, PaginateResult } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from './enums/role';
import { Auth } from 'src/auth/auth.decorator';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { ValidateUserInterceptor } from 'src/interceptors/validate-user.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Auth(Role.ADMIN, Role.CUSTOMER)
@UseInterceptors(ValidateUserInterceptor)
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
  async searchPagedAsync(
    @Query() searchUser: SearchUserDto,
  ): Promise<PaginateResult<User>> {
    return await this.usersService.searchPagedAsync(searchUser);
  }

  @Get(':id')
  async findOneById(@Param('id') id: Types.ObjectId): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateAsync(id, updateUserDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.usersService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.usersService.hardRemoveAsync(id);
  }

  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.usersService.softRemoveAsync(id);
  }
}
