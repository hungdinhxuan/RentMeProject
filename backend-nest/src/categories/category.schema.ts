import { Detail } from '../base/detail.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';


export type CategoryDocument = Category & Document;
export type CategoryModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Category extends Detail{
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

}

export const CategorySchema = SchemaFactory.createForClass(Category)
  .plugin(mongoosePaginate)
