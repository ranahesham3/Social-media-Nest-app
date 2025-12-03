import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ReactionType } from 'src/_cors/types/ReactionType';

export class AddReactionDto {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  reactionType: ReactionType;
}
