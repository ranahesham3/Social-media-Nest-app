import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrivacyType } from 'src/_cores/types/PrivacyType';

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsHexColor()
  backgroundColour?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PrivacyType)
  privacy?: PrivacyType;
}
