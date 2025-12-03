import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  text: string;

  @IsOptional()
  @Type(() => MediaTypeDto)
  mediaFile?: MediaType;
}
