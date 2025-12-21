import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ReactionModule } from 'src/reaction/reaction.module';
import { PostGateway } from './post.gateway';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    CloudinaryModule,
    ReactionModule,
    FriendModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostGateway],
  exports: [PostService],
})
export class PostModule {}
