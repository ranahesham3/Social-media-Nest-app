import { Expose, Transform } from 'class-transformer';
import { CloudinaryResponse } from '../cloudinary-response';

export class ResponseCloudinaryDto {
  //custom property

  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.public_id)
  public_id: string;
  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.url)
  url: string;
}
