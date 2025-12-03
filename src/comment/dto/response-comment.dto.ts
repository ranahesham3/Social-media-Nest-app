import { Expose, Transform, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString, Min } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class ResponseCommentDto {
  @Expose()
  @IsNumber()
  @Min(1)
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.post.id)
  @IsNumber()
  @Min(1)
  postId: number;

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.parentComment?.id)
  @IsNumber()
  @Min(1)
  parentId?: number;

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.author.id)
  @IsNumber()
  @Min(1)
  authorId: number;

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.author.name)
  @IsString()
  authorName: string;

  //TODO: author avatar

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.parentComment?.author.id)
  @IsNumber()
  @Min(1)
  replyToUserId: number;

  @Expose()
  @Transform(({ obj }: { obj: Comment }) => obj.parentComment?.author.name)
  @IsString()
  replyToUserName: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsDateString()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseCommentDto)
  replies: ResponseCommentDto[];
}
