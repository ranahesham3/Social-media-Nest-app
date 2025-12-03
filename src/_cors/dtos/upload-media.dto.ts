import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;
  @IsNumber()
  @IsNotEmpty()
  version: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  format: string;
  @IsString()
  @IsNotEmpty()
  resource_type: string;
}
