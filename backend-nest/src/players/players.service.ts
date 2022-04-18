import { RegisterPlayerDto } from './dto/register-player.dto';
import { PlayerDocument, PlayerModel } from './schemas/player.schema';
import { Player } from './entities/player.entity';
import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument } from 'mongoose';
@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: PlayerModel<PlayerDocument>,
  ) {}

  async registerPlayer(registerPlayer: RegisterPlayerDto) {
    return await this.playerModel.create(registerPlayer);
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

  remove(id: number) {
    return `This action removes a #${id} player`;
  }

  private calculateBirthDateFromAge(age: number): Date {
    const currentDate = new Date();
    const birthDate = new Date();
    birthDate.setFullYear(currentDate.getFullYear() - age);
    return birthDate;
  }
}
