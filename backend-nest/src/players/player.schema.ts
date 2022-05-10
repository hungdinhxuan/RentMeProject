import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { Status } from './enums/status.enum';
import { Detail } from 'src/base/schema/detail.base.schema';

export type PlayerDocument = Player & Document;
export type PlayerModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Player extends Detail {
  @Prop({
    type: String,
    default: '',
    maxlength: 255,
    required: true,
  })
  public nickname: string;
  @Prop({
    type: String,
    default: '',
    maxlength: 255,
    required: true,
  })
  public shortDesc: string;

  @Prop({
    type: String,
    default: '',
    maxlength: 2000,
  })
  public longDesc: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  public userId: Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 1000 })
  public coverBackground: string;

  @Prop({ type: Number, required: true })
  public pricePerHour: number;

  @Prop({ type: String, default: '' })
  public recordVoiceUrl: string;

  @Prop({ type: [String] })
  public albums: string[];

  @Prop({ type: [Number] })
  public timeCanReceive: number[];

  @Prop({ type: String })
  public status: Status;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Game',
      },
    ],
  })
  public games: Types.ObjectId[];
}

export const PlayerSchema =
  SchemaFactory.createForClass(Player).plugin(mongoosePaginate);
