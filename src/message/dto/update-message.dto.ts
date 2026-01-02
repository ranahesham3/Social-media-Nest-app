import { Type } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { MediaTypeDto } from 'src/_cores/dtos/media-type.dto';
import { MediaType } from 'src/_cores/types/MediaType';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  text?: string;

  @IsOptional()
  @Type(() => MediaTypeDto)
  mediaFile?: MediaType;
}
