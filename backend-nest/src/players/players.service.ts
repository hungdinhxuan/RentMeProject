import { RegisterPlayerDto } from './dto/register-player.dto';
import { PlayerDocument, PlayerModel } from './schemas/player.schema';
import { Player } from './entities/player.entity';
import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument } from 'mongoose';
import { SearchPlayerDto } from './dto/search-player.dto';
import { Status } from './enums/status.enum';
import {Types} from 'mongoose';
@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: PlayerModel<PlayerDocument>,
  ) {}

  async registerPlayer(registerPlayer: RegisterPlayerDto) {
    return await this.playerModel.create(registerPlayer);
  }

  async search(searchPlayer: SearchPlayerDto) {
    const { page, limit, sort, order, minAge, maxAge, minPrice, maxPrice } =
      searchPlayer;

    const players = await this.playerModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user.followers',
          foreignField: '_id',
          as: 'followers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user.following',
          foreignField: '_id',
          as: 'following',
        },
      },
      {
        $project: {
          'user.password': 0,
          'user.username': 0,
          'user.email': 0,
          'user.role': 0,
          'user.followers': 0,
          'user.following': 0,
          'user.balance': 0,
          'user.blockList': 0,
          'user.typeAccount': 0,
          'user.deleted': 0,
          'user.createdAt': 0,
          'user.updatedAt': 0,
        },
      },
      {
        $project: {
          'followers.password': 0,
          'followers.username': 0,
          'followers.email': 0,
          'followers.role': 0,
          'followers.followers': 0,
          'followers.following': 0,
          'followers.balance': 0,
          'followers.blockList': 0,
          'followers.typeAccount': 0,
          'followers.deleted': 0,
          'followers.createdAt': 0,
          'followers.updatedAt': 0,

          'following.password': 0,
          'following.username': 0,
          'following.email': 0,
          'following.role': 0,
          'following.followers': 0,
          'following.following': 0,
          'following.balance': 0,
          'following.blockList': 0,
          'following.typeAccount': 0,
          'following.deleted': 0,
          'following.createdAt': 0,
          'following.updatedAt': 0,
        },
      },
      {
        $match: {
          nickname: {
            $regex: searchPlayer.keyword || '',
          },
          'user.gender': {
            $regex: searchPlayer.gender || '',
          },
          'user.birthDate': {
            $lte: this.calculateBirthDateFromAge(minAge), /// ngay sinh nho hon thi nhieu tuoi hon
            $gte: this.calculateBirthDateFromAge(maxAge),
          },
          pricePerHour: {
            $gte: minPrice,
            $lte: maxPrice,
          },
          // status: Status.ACCEPTED
        },
      },
      { $sort: { [sort]: order === 'asc' ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    const count = await this.playerModel.find().count();
    const pages = limit > 0 ? Math.ceil(count / limit) || 1 : null;
    return {
      docs: players,
      totalDocs: count,
      limit: limit,
      totalPages: pages,
      page: page,

      // The starting index/serial/chronological number of first document in current page
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < pages,
      prevPage: page - 1 > 0 ? page - 1 : null,
      nextPage: page < pages ? page + 1 : null,
    };
  }

  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
  }

  findAll() {
    return `This action returns all players`;
  }

  async findOne(obj: object): Promise<LeanDocument<Player & PlayerDocument>> {
    return await this.playerModel.findOne(obj).lean().exec();
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.playerModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.playerModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.playerModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }

  private calculateBirthDateFromAge(age: number): Date {
    const currentDate = new Date();
    const birthDate = new Date();
    birthDate.setFullYear(currentDate.getFullYear() - age);
    return birthDate;
  }
}
