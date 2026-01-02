import { Expose, Transform, Type } from 'class-transformer';
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
import { User } from 'src/user/entities/user.entity';

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
  @Transform(({ obj }: { obj: User }) => obj.avatar?.url)
  avatar?: string;
}
