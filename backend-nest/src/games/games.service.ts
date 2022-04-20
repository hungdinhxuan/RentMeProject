import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, GameDocument, GameModel } from './schemas/game.schema';
import {PaginateResult} from 'mongoose';
import {Types} from 'mongoose';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: GameModel<GameDocument>,) {}
  async create(createGameDto: CreateGameDto) {
    return await this.gameModel.create(createGameDto);
  }

  async searchPaged(
    searchGame: SearchGameDto,
  ): Promise<PaginateResult<Game>> {
    console.log(searchGame);

    return await this.gameModel.paginate(
      {
        $or: [{ name: { $regex: searchGame.keyword || '' } }],
      },
      {
        page: searchGame.page,
        limit: searchGame.limit,
        sort: { [searchGame.sort]: searchGame.order },
        lean: true,
        allowDiskUse: true,
      },
    );
  }

  findAll() {
    return `This action returns all games`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  
  restore(id: Types.ObjectId) {
    return `This action restores a #${id} category`;
  }
}
