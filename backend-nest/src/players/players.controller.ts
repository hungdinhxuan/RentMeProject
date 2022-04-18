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
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary.service';
import { Status } from './enums/status.enum';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
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
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  async registerBecomePlayer(
    @Body() registerPlayerForm: RegisterPlayerFormDto,
    @Request() req,
    @Response() res,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!registerPlayerForm.userId.equals(req.user.id)) {
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
