import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from 'src/_cors/guards/auth.guard';
import { CurrentUser } from 'src/_cors/decorators/current-user.decorator';
import type { JwtType } from 'src/_cors/types/JwtType';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { ResponseNotificationDto } from './dto/response-notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @TransformDTO(ResponseNotificationDto)
  findAll(
    @CurrentUser() user: JwtType,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe)
    pageNumber: number,
  ) {
    return this.notificationService.findAll(user.id, limit, pageNumber);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtType,
  ) {
    return this.notificationService.markOneNotificationAsRead(id, user.id);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: JwtType) {
    return this.notificationService.markAllNotificationsAsRead(user.id);
  }
}
