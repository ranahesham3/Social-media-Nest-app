import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';
import { UserType } from 'src/_cors/types/userType';

export class ResponseFriendDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name?: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @Type(() => MediaTypeDto)
  avatar?: MediaType;
}
