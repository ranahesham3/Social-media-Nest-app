import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';
import { MediaTypeDto } from 'src/_cors/dtos/media-type.dto';
import { MediaType } from 'src/_cors/types/MediaType';
import { Message } from '../entities/message.entity';

export class SeenByDto {
  @Expose()
  id: number;

  @Expose()
  name?: string;

  @Expose()
  @Type(() => MediaTypeDto)
  avatar?: MediaType;
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
  @Transform(({ obj }: { obj: Message }) => obj.sender?.avatar)
  @Type(() => MediaTypeDto)
  senderAvatar?: MediaType;

  @Expose()
  @IsString()
  @Length(1, 1000)
  text: string;

  @Expose()
  @Type(() => MediaTypeDto)
  mediaFile?: MediaType;

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
