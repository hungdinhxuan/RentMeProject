import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { SearchGameDto } from './dto/search-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, GameDocument, GameModel } from './game.schema';
import {PaginateResult} from 'mongoose';
import {Types} from 'mongoose';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: GameModel<GameDocument>,) {}
  async createAsync(createGameDto: CreateGameDto) {
    return await this.gameModel.create(createGameDto);
  }

  async searchPagedAsync(
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

  async findOneAsync(obj: object) {
    return await this.gameModel.findOne(obj);
  }

  async updateAsync(id: Types.ObjectId, updateGameDto: UpdateGameDto) {
    return await this.gameModel.findByIdAndUpdate(id, updateGameDto, {new: true});
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.gameModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.gameModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.gameModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
