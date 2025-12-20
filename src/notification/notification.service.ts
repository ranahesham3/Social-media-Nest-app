import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(currentUserId: number, limit: number, pageNumber: number) {
    const receiver = await this.userService.findOne(currentUserId);

    const skip = (pageNumber - 1) * limit;

    return await this.notificationRepository.find({
      where: {
        receiver: { id: currentUserId },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async markOneNotificationAsRead(id: number, currentUserId: number) {
    const receiver = await this.userService.findOne(currentUserId);

    const notification = await this.notificationRepository.findOneBy({
      id,
      receiver: { id: currentUserId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;
    await this.notificationRepository.save(notification);

    return {
      message: 'Notification marked as read successfully!',
    };
  }

  async markAllNotificationsAsRead(currentUserId: number) {
    const receiver = await this.userService.findOne(currentUserId);

    const notifications = await this.notificationRepository.find({
      where: {
        receiver: { id: currentUserId },
        isRead: false,
      },
      order: { createdAt: 'DESC' },
    });
    notifications.forEach((n) => (n.isRead = true));

    await this.notificationRepository.save(notifications);

    return {
      message: 'Notifications marked as read successfully!',
    };
  }
}
