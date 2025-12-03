import { Expose, Transform, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';
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
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.avatar)
  @Type(() => MediaTypeDto)
  senderAvatar?: MediaType;

  @Expose()
  @Transform(({ obj }: { obj: FriendRequest }) => obj.sender.coverPhoto)
  @Type(() => MediaTypeDto)
  senderCoverPhoto?: MediaType;
}
