import { Detail } from '../base/schema/detail.base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type CommentDocument = Comment & Document;
export type CommentModel<T extends Document> = PaginateModel<T>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Comment extends Detail {
  @Prop({
    type: String,
    default: '',
    maxlength: 3000,
    required: true,
  })
  public content: string;

  @Prop({
    type: [
      {
        type: String,
        default: '',
        maxlength: 1000,
        required: true,
      },
    ],
  })
  public images: string[];

  @Prop({
    type: Types.ObjectId,
    required: false,
    ref: 'User',
  })
  public likes: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
  })
  public reply: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  public postId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  public postUserId: Types.ObjectId;
}

export const CommentSchema =
  SchemaFactory.createForClass(Comment).plugin(mongoosePaginate);
