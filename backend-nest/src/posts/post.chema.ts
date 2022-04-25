import { Detail } from '../base/detail.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';


export type PostDocument = Post & Document;
export type PostModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Post extends Detail{
  @Prop({
    type: String, default: '', maxlength: 3000, required: true
  })
  public content: string;

  @Prop({
    type: [{
        type: String,
        default: '', 
        maxlength: 1000, 
        required: true
    }], 
  })
  public images: string[];

  @Prop({
    type: Types.ObjectId, required: false, ref: 'User',
 })
  public likes: Types.ObjectId[];


  @Prop({
      type: [{ type: Types.ObjectId, ref: 'comment' }]
  })
  public comments: Types.ObjectId[];

  @Prop({
    type: String, default: '', maxlength: 1000, required: false
  })
  public description: string;

  @Prop({ type: String, default: '', maxlength: 255, required: false})
  public backgroundUrl: string;


}

export const PostSchema = SchemaFactory.createForClass(Post)
  .plugin(mongoosePaginate)
