import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema, Player } from './player.schema';
import { CloudinaryService } from 'src/cloudinary.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    UsersModule
  ],
  controllers: [PlayersController],
  providers: [PlayersService,  CloudinaryService],
})
export class PlayersModule {}
