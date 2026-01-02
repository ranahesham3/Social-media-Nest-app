import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Message } from '../entities/message.entity';
import { User } from 'src/user/entities/user.entity';

export class SeenByDto {
  @Expose()
  id: number;

  @Expose()
  name?: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) => obj.avatar?.url)
  avatar?: string;
}

export class ResponseMessageDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: Message }) => obj.conversation.id)
  conversation: number;

  @Expose()
  @Transform(({ obj }: { obj: Message }) => obj.sender.id)
  senderId: number;

  @Expose()
  @Transform(({ obj }: { obj: Message }) => obj.sender?.name)
  senderName: string;

  @Expose()
  @Transform(({ obj }: { obj: Message }) => obj.sender?.avatar?.url)
  senderAvatar?: string;

  @Expose()
  @IsString()
  @Length(1, 1000)
  text: string;

  @Expose()
  @Transform(({ obj }: { obj: Message }) => obj.mediaFile?.url)
  mediaFile?: string;

  @Expose()
  @IsBoolean()
  isDeleted: boolean;

  @Expose()
  @Transform(({ obj }: { obj: Message }) =>
    obj.seenBy?.map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    })),
  )
  @Type(() => SeenByDto)
  seenBy: SeenByDto[];
}
