import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentModel, Comment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import SearchCommentDto from './dto/search-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {PaginateResult, Types} from 'mongoose';


@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: CommentModel<CommentDocument>,
  ) {}
  
  async createAsync(createCommentDto: CreateCommentDto) {
    return await this.commentModel.create(createCommentDto);
  }

  async searchPagedAsync(
    searchComment: SearchCommentDto,
  ): Promise<PaginateResult<Comment>> {
    console.log(searchComment);

    return await this.commentModel.paginate(
      {
        $or: [{ name: { $regex: searchComment.keyword || '' } }],
      },
      {
        page: searchComment.page,
        limit: searchComment.limit,
        sort: { [searchComment.sort]: searchComment.order },
        lean: true,
        allowDiskUse: true,
      },
    );
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOneAsync(obj: object) {
    return await this.commentModel.findOne(obj);
  }

  async updateAsync(id: Types.ObjectId, updateCommentDto: UpdateCommentDto) {
    return await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
      new: true,
    });
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.commentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.commentModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.commentModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
