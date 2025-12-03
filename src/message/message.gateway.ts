import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseMessageDto, SeenByDto } from './dto/response-message.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server; //===io

  //===io.on('connection',socket=>{})
  handleConnection(client: Socket) {
    console.log(`Client connect with id = ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect with id = ${client.id}`);
  }

  //====io.on('message')          the server recieves data from client
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(conversationId);
  }

  handleNewMessage(conversationId: string, message: ResponseMessageDto) {
    this.server.to(conversationId).emit('new_message', message);
  }

  handlUpdatedMessage(conversationId: string, message: ResponseMessageDto) {
    this.server.to(conversationId).emit('updated_message', message);
  }

  handlDeletedMessage(conversationId: string, message: ResponseMessageDto) {
    console.log(message);
    this.server.to(conversationId).emit('deleted_message', message);
  }

  handlSeenMessage(
    conversationId: string,
    messageId: string,
    seenBy: SeenByDto,
  ) {
    console.log('seen by', seenBy);
    this.server.to(conversationId).emit('seen_message', { messageId, seenBy });
  }
}
