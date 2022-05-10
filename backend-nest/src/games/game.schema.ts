import { Detail } from '../base/schema/detail.base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, PaginateModel, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';

export type GameDocument = Game & Document;
export type GameModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Game extends Detail{
  @Prop({
    type: String, default: '', maxlength: 255, required: true
  })
  public name: string;
  @Prop({
    type: String, default: '', maxlength: 1000, required: false
  })
  public description: string;

  @Prop({ type: String, default: '', maxlength: 255, required: false})
  public backgroundUrl: string;

  @Prop({
    type: Types.ObjectId, required: true, ref: 'Category'
  })
  public categoryId: string;
}

export const GameSchema = SchemaFactory.createForClass(Game)
  .plugin(mongoosePaginate)
  .plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
  });
