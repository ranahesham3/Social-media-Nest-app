import { Expose, Transform } from 'class-transformer';
import { CloudinaryResponse } from '../cloudinary-response';

export class ResponseCloudinaryDto {
  //custom property

  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.public_id)
  public_id: string;
  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.version)
  version: number;
  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.display_name)
  name: string;
  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.format)
  format: string;
  @Expose()
  @Transform(({ obj }: { obj: CloudinaryResponse }) => obj.resource_type)
  resource_type: string;
}
