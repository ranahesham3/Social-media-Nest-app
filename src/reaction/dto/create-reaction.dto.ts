import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ReactionType } from 'src/_cores/types/ReactionType';

export class CreateReactionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  postId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number;

  @IsEnum(ReactionType)
  @IsNotEmpty()
  reactionType: ReactionType;
}
