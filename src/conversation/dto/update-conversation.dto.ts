import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MediaTypeDto } from 'src/_cores/dtos/media-type.dto';
import { MediaType } from 'src/_cores/types/MediaType';

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  groupName?: string;

  @IsOptional()
  @Type(() => MediaTypeDto)
  groupAvatar?: MediaType;
}
