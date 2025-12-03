import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseFriendRequestDto } from './dto/response-request-friend.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway {
  @WebSocketServer()
  server: Server; //===io

  handleSentFriendRequest(
    recieverId: string,
    friendRequest: ResponseFriendRequestDto,
  ) {
    this.server.to(recieverId).emit('sent-friend-request', friendRequest);
  }
  // handleNewComment(comment: ResponseCommentDto) {
  //   this.server.emit('new_comment', comment);
  // }
}
