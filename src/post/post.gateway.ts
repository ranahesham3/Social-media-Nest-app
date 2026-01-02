import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponsePostDto } from './dto/response-post.dto';
import { UploadMediaDto } from 'src/_cores/dtos/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PostGateway {
  @WebSocketServer()
  server: Server;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  handleNewPost(post: ResponsePostDto) {
    this.server.emit('new_post', post);
  }

  handleUpdatedPost(postId: number, updatePostDto: UpdatePostDto) {
    console.log(postId, updatePostDto);
    this.server.emit('updated_post', { postId, updatePostDto });
  }

  handleDeletedPost(postId: number) {
    this.server.emit('deleted_post', postId);
  }

  handleUploadedMedia(postId: number, uploadedMedia: UploadMediaDto[]) {
    console.log(postId, uploadedMedia);
    this.server.emit('upload_post_media', { postId, uploadedMedia });
  }

  handleDeletedMedia(postId: number, deletedMedia: DeleteMediaDto) {
    console.log(postId, deletedMedia);
    this.server.emit('upload_post_media', { postId, deletedMedia });
  }

  handleAddReaction(post: ResponsePostDto) {
    this.server.emit('post_add_reaction', post);
  }
}
