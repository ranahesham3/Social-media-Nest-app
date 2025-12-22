import { Expose, Transform, Type } from 'class-transformer';
import { PrivacyType } from 'src/_cors/types/PrivacyType';
import { Post } from '../entities/post.entity';
import { MediaType } from 'src/_cors/types/MediaType';
import { ReactionType } from 'src/_cors/types/ReactionType';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';

export class ResponsePostDto {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  reactionCounts: {
    love: number;
    like: number;
    haha: number;
    angry: number;
    wow: number;
    sad: number;
  };
  @Expose()
  privacy: PrivacyType;
  @Expose()
  @Type(() => MediaTypeDto)
  mediaFiles?: MediaType[];
  @Expose()
  backgroundColour: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  //custom property
  @Expose()
  @Transform(({ obj }: { obj: Post }) => obj.author.id)
  authorId: number;
  @Expose()
  @Transform(({ obj }: { obj: Post }) => obj.author.name)
  authorName: string;
  @Expose()
  @Transform(({ obj }: { obj: Post }) => obj.author.email)
  authorEmail: string;

  @Expose()
  myReaction?: ReactionType;
}
