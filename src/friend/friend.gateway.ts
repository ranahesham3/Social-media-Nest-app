import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseFriendRequestDto } from './dto/response-request-friend.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway {
  @WebSocketServer()
  server: Server; //===io

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId);
  }

  handleSentFriendRequest(
    recieverId: string,
    friendRequest: ResponseFriendRequestDto,
  ) {
    this.server.to(recieverId).emit('sent-friend-request', friendRequest);
  }
}
