import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Post } from '../entities/post.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { ReactionType } from 'src/_cors/types/ReactionType';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';

export class ResponsePostReactionDto {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @Transform(({ obj }: { obj: Reaction }) => obj.post.id)
  post: number;
  @Expose()
  @Transform(({ obj }: { obj: Reaction }) => obj?.user?.id)
  userId: string;
  @Expose()
  @Transform(({ obj }: { obj: Reaction }) => obj?.user?.name)
  userName: string;
  @Expose()
  @Transform(({ obj }: { obj: Reaction }) => obj?.user?.avatar)
  @Type(() => MediaTypeDto)
  userAvatar: MediaType;
  @Expose()
  type: ReactionType;
}
