import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Name property need to be at least 3 characters' })
  @MaxLength(30, { message: 'Name property need to be at most 30 characters' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'Bio property need to be at most 30 characters' })
  bio?: string;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
