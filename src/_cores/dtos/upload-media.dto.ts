import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;
  @IsNumber()
  @IsNotEmpty()
  url: string;
}
