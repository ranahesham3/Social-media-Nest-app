import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString, Min } from 'class-validator';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';
import { Conversation } from '../entities/conversation.entity';

export class ParticipantDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name?: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @Type(() => MediaTypeDto)
  avatar: MediaType;
}

export class ResponseConversationDto {
  @Expose()
  @IsNumber()
  @Min(1)
  id: number;

  @Expose()
  isGroup: boolean;

  @Expose()
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];

  @Expose()
  @Transform(({ obj }: { obj: Conversation }) => obj.groupOwner?.id)
  groupOwnerId?: number;

  @Expose()
  @Transform(({ obj }: { obj: Conversation }) => obj.groupOwner?.name)
  groupOwnerName?: string;

  @Expose()
  @Transform(({ obj }: { obj: Conversation }) => obj.groupOwner?.email)
  groupOwnerEmail?: string;

  @Expose()
  groupName: string;
  @Expose()
  @Type(() => MediaTypeDto)
  groupAvatar: MediaType;

  @Expose()
  @Transform(({ obj }: { obj: Conversation }) => obj.lastMessage.text)
  lastMessage: string;

  @Expose()
  @Transform(({ obj }: { obj: Conversation }) => obj.lastMessage.sender.name)
  lastMessageSender: string;

  @Expose()
  @IsBoolean()
  isLastMessageSeen: boolean;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
