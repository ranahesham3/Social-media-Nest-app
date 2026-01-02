import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from 'src/_cores/types/ResourceType';
import { Comment } from 'src/comment/entities/comment.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getResource(
    resourceType: ResourceType,
    resourceId: number,
  ): Promise<number> {
    switch (resourceType) {
      case ResourceType.User: {
        const user = await this.userRepository.findOneBy({ id: resourceId });
        if (!user) throw new NotFoundException('User not found');
        return user.id;
      }
      case ResourceType.POST: {
        const post = await this.postRepository.findOneBy({ id: resourceId });
        if (!post) throw new NotFoundException('Post not found');
        return post.author.id;
      }
      case ResourceType.COMMENT: {
        const comment = await this.commentRepository.findOneBy({
          id: resourceId,
        });
        if (!comment) throw new NotFoundException('comment not found');
        return comment.author.id;
      }
      default:
        throw new Error('Resource not found');
    }
  }
}
