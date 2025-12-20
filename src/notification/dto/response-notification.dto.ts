import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString, Min } from 'class-validator';
import { Notification } from '../entities/notification.entity';
import { MediaType } from 'src/_cors/types/MediaType';
import { NotificationType } from 'src/_cors/types/NotificationType';

export class ResponseNotificationDto {
  @Expose()
  @IsNumber()
  @Min(1)
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: Notification }) => obj.sender.id)
  @IsNumber()
  @Min(1)
  senderId: number;

  @Expose()
  @Transform(({ obj }: { obj: Notification }) => obj.sender.name)
  @IsString()
  senderName: number;

  @Expose()
  @Transform(({ obj }: { obj: Notification }) => obj.sender.avatar)
  senderAvatar: MediaType;

  @Expose()
  type: NotificationType;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsBoolean()
  isRead: boolean;

  @Expose()
  @IsNumber()
  @Min(1)
  targetId: number;

  @Expose()
  @IsDate()
  createdAt: Date;
}
