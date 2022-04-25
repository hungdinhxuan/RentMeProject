import { Detail } from '../base/detail.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';


export type NotificationDocument = Notification & Document;
export type NotificationModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Notification extends Detail{
  @Prop({
    type: String, default: '', maxlength: 3000, required: true
  })
  public Content: string;
  @Prop({
    type: Types.ObjectId, ref: 'User'
  })
  public userId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
  .plugin(mongoosePaginate)
