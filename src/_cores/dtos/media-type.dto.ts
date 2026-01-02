import { Expose } from 'class-transformer';

export class MediaTypeDto {
  @Expose()
  url: string;
  @Expose()
  public_id: string;
}
