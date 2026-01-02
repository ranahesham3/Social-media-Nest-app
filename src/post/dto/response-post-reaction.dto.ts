import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { ReactionType } from 'src/_cores/types/ReactionType';

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
  @Transform(({ obj }: { obj: Reaction }) => obj?.user?.avatar?.url)
  userAvatar: string;
  @Expose()
  type: ReactionType;
}
