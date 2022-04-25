import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, PaginateResult } from 'mongoose';
import BcryptHelper from 'src/utils/bcrypt.util';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserModel } from './user.schema';
import { LeanDocument } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await BcryptHelper.hashPassword(
      createUserDto.password,
    );
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }

  async searchPagedAsync(searchUser: SearchUserDto): Promise<PaginateResult<User>> {
    console.log(searchUser);

    return await this.userModel.paginate(
      {
        $or: [
          { username: { $regex: searchUser.keyword || '' } },
          { email: { $regex: searchUser.keyword || '' } },
        ],

        role: {
          $regex: searchUser.role || '',
        },
      },
      {
        page: searchUser.page,
        limit: searchUser.limit,
        sort: { [searchUser.sort]: searchUser.order },
        lean: true,
        select: '-password',
        allowDiskUse: true,
      },
    );
  }

  async findOneById(
    id: Types.ObjectId,
  ): Promise<LeanDocument<User & UserDocument>> {
    return await this.userModel.findById(id).lean().exec();
  }

  async findOne(obj: object): Promise<LeanDocument<User & UserDocument>> {
    return await this.userModel.findOne(obj).lean().exec();
  }

  async updateAsync(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async findOneAndUpdateAsync(obj: object, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate(obj, updateUserDto, {
      new: true,
    });
  }

  async findOneByUsernameAndUpdateStatus(username: string, isOnline: boolean) {
    return await this.userModel.findOneAndUpdate(
      { username },
      { isOnline },
      { new: true },
    );
  }

  async updatePassword(id: Types.ObjectId, newPassword: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      password: await BcryptHelper.hashPassword(newPassword),
    });
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.userModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
