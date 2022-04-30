import { PostDocument, PostModel, Post } from './post.chema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import {PaginateResult, Types} from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModel<PostDocument>,
  ) {}
  
  async createAsync(createPostDto: CreatePostDto) {
    return await this.postModel.create(createPostDto);
  }

  async searchPagedAsync(
    searchPost: SearchPostDto,
  ): Promise<PaginateResult<Post>> {
    console.log(searchPost);

    return await this.postModel.paginate(
      {
        $or: [{ name: { $regex: searchPost.keyword || '' } }],
      },
      {
        page: searchPost.page,
        limit: searchPost.limit,
        sort: { [searchPost.sort]: searchPost.order },
        lean: true,
        allowDiskUse: true,
      },
    );
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOneAsync(obj: object) {
    return await this.postModel.findOne(obj);
  }

  async updateAsync(id: Types.ObjectId, updatePostDto: UpdatePostDto) {
    return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.postModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.postModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.postModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
