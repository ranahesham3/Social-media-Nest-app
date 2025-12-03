import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  parentCommentId?: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
