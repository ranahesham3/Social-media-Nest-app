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
import { UserType } from 'src/_cores/types/userType';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum(UserType)
  role?: UserType;

  @Expose()
  @IsString()
  bio?: string;

  @Expose()
  @IsDate()
  birthday?: Date;

  @Expose()
  @IsString()
  phoneNumber?: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.avatar?.url)
  avatar?: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.coverPhoto?.url)
  coverPhoto?: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsBoolean()
  isFriend: boolean;
}
