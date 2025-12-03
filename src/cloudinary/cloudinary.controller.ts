import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { ResponseCloudinaryDto } from './dto/response-cloudinary.dto';

@TransformDTO(ResponseCloudinaryDto)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadFile(file);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.cloudinaryService.uploadFiles(files);
  }
}
