import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrivacyType } from 'src/_cores/types/PrivacyType';

export class CreatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsHexColor()
  backgroundColour?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PrivacyType)
  privacy?: PrivacyType;
}
