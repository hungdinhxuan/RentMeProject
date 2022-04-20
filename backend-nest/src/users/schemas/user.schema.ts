import { Detail } from './../../base/detail.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import { Gender } from '../enums/gender.enum';
import { Province } from '../enums/province.enum';
import { Role } from '../enums/role';
import { TypeAccount } from '../enums/type-account.enum';

import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import { Status } from '../enums/status.enum';

export type UserDocument = User & Document;
export type UserModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Detail{
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 64,
    index: true,
  })
  public username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: 255,
  })
  public email: string;

  @Prop({ type: String, required: true })
  public password: string;

  @Prop({ type: String, required: true, maxlength: 255 })
  public fullName: string;

  @Prop({
    type: String,
    default:
      'https://res.cloudinary.com/rentme-store/image/upload/v1633957597/rentme/default_avatar.png',
    maxlength: 500,
    required: true,
  })
  public avatar: string;

  @Prop({ type: Number, default: 0 })
  public balance: number;

  @Prop({ type: String, default: '', maxlength: 200 })
  public nickname: string;

  @Prop({ type: String, default: '', maxLength: 1000 })
  public desc: string;

  @Prop({ type: Boolean, default: false, required: true })
  public isOnline: boolean;

  @Prop({ type: Date, default: '2000-01-01', required: true })
  public birthDate: Date;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  public following?: User[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  public followers?: User[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  public blockList?: User[];

  @Prop({
    type: String,
    default: TypeAccount.LOCAL,
    enum: TypeAccount,
    required: true,
  })
  public typeAccount: TypeAccount;

  @Prop({ type: String, default: Role.CUSTOMER, required: true })
  public role: Role;

  @Prop({
    type: String,
    default: Gender.MALE,
    required: true,
  })
  public gender: Gender;

  @Prop({ type: String, default: Province['Hồ Chí Minh'], maxlength: 500 })
  public province: Province;

  @Prop({ type: String, default: Status.FREE })
  public status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .plugin(mongoosePaginate)
  .plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
  });
