import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ReactionType } from 'src/_cores/types/ReactionType';

export class UpdateReactionDto {
  @IsEnum(ReactionType)
  @IsOptional()
  @IsNotEmpty()
  type: ReactionType;
}
