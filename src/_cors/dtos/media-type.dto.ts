import { Expose, Transform } from 'class-transformer';
import { MediaType } from '../types/MediaType';

export class MediaTypeDto {
  @Expose()
  @Transform(
    ({ obj }: { obj: MediaType }) =>
      `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/v${obj.version}/${obj.name}.${obj.format}`,
  )
  url: string;
  @Expose()
  public_id: string;
  @Expose()
  version: number;
  @Expose()
  name: string;
  @Expose()
  format: string;
  @Expose()
  resource_type: string;
}
