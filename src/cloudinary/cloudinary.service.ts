// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result: CloudinaryResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        },
      );
      // to convert any Buffer or string into a Readable Stream
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadFiles(files: Express.Multer.File[]): Promise<CloudinaryResponse[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }
}
