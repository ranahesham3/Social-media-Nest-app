import { Expose, Transform, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { FriendRequest } from '../entities/friend.entity';

export class ResponseFriendRequestDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.id)
  @IsNumber()
  senderId: number;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.name)
  @IsString()
  senderName?: string;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.email)
  @IsEmail()
  senderEmail: string;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.avatar?.url)
  senderAvatar?: string;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.coverPhoto?.url)
  senderCoverPhoto?: string;
}
