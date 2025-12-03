import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostModule } from 'src/post/post.module';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';
import { CommentGateway } from './comment.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService, CommentGateway],
  exports: [CommentService],
})
export class CommentModule {}
