import { Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from 'src/_cors/types/NotificationType';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async create(
    senderId: number,
    recieverId: number,
    type: NotificationType,
    content: string,
    targetId?: number,
  ) {
    const sender = await this.userService.findOne(senderId);
    const receiver = await this.userService.findOne(recieverId);

    let notification = this.notificationRepository.create({
      sender,
      receiver,
      type,
      content,
      targetId,
    });

    notification = await this.notificationRepository.save(notification);

    //TODO: Real Time
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
