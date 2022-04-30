import {
  NotificationDocument,
  NotificationModel,
  Notification
} from './notification.schema';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SearchNotificationDto } from './dto/search-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: NotificationModel<NotificationDocument>,
  ) {}
  async createAsync(createNotificationDto: CreateNotificationDto) {
    return await this.notificationModel.create(createNotificationDto);
  }

  async searchPagedAsync(searchNotification: SearchNotificationDto) {
    console.log(searchNotification);

    return await this.notificationModel.paginate(
      {
        $or: [{ name: { $regex: searchNotification.keyword || '' } }],
      },
      {
        page: searchNotification.page,
        limit: searchNotification.limit,
        sort: { [searchNotification.sort]: searchNotification.order },
        lean: true,
        allowDiskUse: true,
      },
    );
  }

  async findOneAsync(obj: object) {
    return await this.notificationModel.findOne(obj);
  }

  async updateAsync(
    id: Types.ObjectId,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationModel.findByIdAndUpdate(
      id,
      updateNotificationDto,
      {
        new: true,
      },
    );
  }

  async softRemoveAsync(id: Types.ObjectId) {
    return await this.notificationModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async hardRemoveAsync(id: Types.ObjectId) {
    return await this.notificationModel.findByIdAndRemove(id);
  }

  async restoreAsync(id: Types.ObjectId) {
    return await this.notificationModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
  }
}
