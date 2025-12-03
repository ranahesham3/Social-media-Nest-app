import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, Conversation])],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
