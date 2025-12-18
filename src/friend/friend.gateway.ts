import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseFriendRequestDto } from './dto/response-request-friend.dto';
import { ResponseFriendDto } from './dto/response-friend.dto';

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

  handleAcceptedFriendRequest(
    senderId: string,
    friendRequest: ResponseFriendDto,
  ) {
    this.server.to(senderId).emit('accepted-friend-request', friendRequest);
  }

  handleRejectedFriendRequest(senderId: string, friendRequestId: string) {
    this.server.to(senderId).emit('rejected-friend-request', friendRequestId);
  }

  handleCanceledFriendRequest(recieverId: string, friendRequestId: string) {
    this.server.to(recieverId).emit('canceled-friend-request', friendRequestId);
  }
}
