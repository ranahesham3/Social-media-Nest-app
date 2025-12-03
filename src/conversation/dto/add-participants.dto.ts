import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';
export class AddParticipantsDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  participantsIds: number[];
}
