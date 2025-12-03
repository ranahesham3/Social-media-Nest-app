import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ResourceModule } from './resource/resource.module';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReactionModule } from './reaction/reaction.module';
import { Reaction } from './reaction/entities/reaction.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FriendModule } from './friend/friend.module';
import { FriendRequest } from './friend/entities/friend.entity';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './message/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [
        User,
        Post,
        Reaction,
        Comment,
        FriendRequest,
        Conversation,
        Message,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
    PostModule,
    ResourceModule,
    CloudinaryModule,
    ReactionModule,
    CommentModule,
    FriendModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
