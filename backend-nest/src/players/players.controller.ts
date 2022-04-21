import { PaginateResult } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { RegisterPlayerFormDto } from './dto/register-player-form.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFiles,
  Response,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary.service';
import { Status } from './enums/status.enum';
import { Auth } from 'src/auth/auth.decorator';
import { ValidateUserInterceptor } from 'src/interceptors/validate-user.interceptor';
import { Role } from 'src/users/enums/role';
import { SearchPlayerDto } from './dto/search-player.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PicturesUploadDto } from './dto/pictures-upload.dto';
import {Types} from 'mongoose';

@ApiTags('players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('search')
  @UsePipes( new ValidationPipe( { transform: true, transformOptions: {enableImplicitConversion: true} }))
  async searchPagedAsync(
    @Query() searchPlayer: SearchPlayerDto,
  ) {
    
    return await this.playersService.search(searchPlayer);
  }

  @Auth(Role.CUSTOMER)
  @UseInterceptors(ValidateUserInterceptor)
  @Post('register')
  @UsePipes( new ValidationPipe( { transform: true, transformOptions: {enableImplicitConversion: true} }))
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      fileFilter: (req, file: Express.Multer.File, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 4, // 4MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of pictures',
    type: PicturesUploadDto,
  })
  async registerBecomePlayer(
    @Body() registerPlayerForm: RegisterPlayerFormDto,
    @Request() req,
    @Response() res,
    @UploadedFiles() files: Array<Express.Multer.File> = [],
  ) {
    if (files.length === 0) {
      throw new HttpException('No files were uploaded', HttpStatus.BAD_REQUEST);
    }

    if (files.length < 4) {
      throw new HttpException(
        'You must upload 4 images',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!registerPlayerForm.userId === req.user.userId) {
      throw new HttpException(
        'You are not allowed to register this player',
        HttpStatus.FORBIDDEN,
      );
    }
    const player = await this.playersService.findOne({
      userId: registerPlayerForm.userId,
    });

    if (player) {
      if (player.status === Status.UNDER_REVIEW) {
        throw new HttpException(
          'Your request is processing ! Please wait until admin accept',
          HttpStatus.BAD_REQUEST,
        );
      } else if (player.status === Status.ACCEPTED) {
        throw new HttpException(
          'You are already a player',
          HttpStatus.BAD_REQUEST,
        );
      } else if (player.status === Status.BANNED) {
        throw new HttpException('You are banned', HttpStatus.BAD_REQUEST);
      }
    } else {
      const result = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFile(file)),
      );
      let coverBackground = result.shift();

      return res.status(HttpStatus.CREATED).json({
        message:
          'Player created successfully ! Please wait until admin consider your profile',
        player: await this.playersService.registerPlayer({
          ...registerPlayerForm,
          coverBackground: coverBackground.secure_url,
          albums: result.map((album) => album.secure_url),
        }),
      });
    }
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto);
  }

  @Patch(':id/restore')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async restoreAsync(@Param('id') id: Types.ObjectId) {
    return await this.playersService.restoreAsync(id);
  }

  @Delete(':id/soft')
  async hardRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.playersService.hardRemoveAsync(id);
  }
  @Delete(':id/hard')
  async softRemoveAsync(@Param('id') id: Types.ObjectId) {
    return await this.playersService.softRemoveAsync(id);
  }
}
