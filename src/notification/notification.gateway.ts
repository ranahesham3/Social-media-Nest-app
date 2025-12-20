import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ResponseNotificationDto } from './dto/response-notification.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  handleNewNotification(
    receiverId: string,
    notification: ResponseNotificationDto,
  ) {
    this.server.to(receiverId).emit('new_notification', notification);
  }
}
