import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString, Min } from 'class-validator';
import { Conversation } from '../entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

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
  @Transform(({ obj }: { obj: User }) => obj.avatar?.url)
  avatar: string;
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
  @Transform(({ obj }: { obj: Conversation }) => obj.groupAvatar?.url)
  groupAvatar: string;

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
