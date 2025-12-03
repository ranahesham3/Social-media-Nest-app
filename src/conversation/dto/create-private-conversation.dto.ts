import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePrivateConversationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  participantId: number;
}
