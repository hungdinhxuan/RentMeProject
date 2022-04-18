import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class AppService {
  constructor(private cloudinary: CloudinaryService) {}
  async uploadFileToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadFile(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
