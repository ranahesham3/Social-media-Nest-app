import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Post, User])],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
