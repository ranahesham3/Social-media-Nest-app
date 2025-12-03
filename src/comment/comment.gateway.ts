import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponseCommentDto } from './dto/response-comment.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentGateway {
  @WebSocketServer()
  server: Server; //===io

  handleNewComment(comment: ResponseCommentDto) {
    this.server.emit('new_comment', comment);
  }

  handleUpdatedComment(
    commentId: number,
    commentContent: string,
    updatedAt: Date,
  ) {
    this.server.emit('updated_comment', {
      commentId,
      commentContent,
      updatedAt,
    });
  }

  handledeletedComment(commenId: number, parentId?: number) {
    this.server.emit('deleted_comment', { commenId, parentId });
  }
}
