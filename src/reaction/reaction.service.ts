import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactioneRepository: Repository<Reaction>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createReactionDto: CreateReactionDto) {
    const user = await this.userRepository.findOneBy({
      id: createReactionDto.userId,
    });
    if (!user) throw new UnauthorizedException('Try to login again');

    const post = await this.postRepository.findOneBy({
      id: createReactionDto.postId,
    });
    if (!post) throw new NotFoundException('Post not found');

    const reaction = this.reactioneRepository.create({
      type: createReactionDto.reactionType,
      user,
      post,
    });
    const r = await this.reactioneRepository.save(reaction);
    console.log(r);
    return r;
  }

  findAll() {
    return `This action returns all reaction`;
  }

  async findOne(id: number) {
    const reaction = await this.reactioneRepository.findOneBy({ id });
    if (!reaction) throw new NotFoundException('Reaction not found');
    return reaction;
  }

  async findExisting(postId: number, userId: number) {
    return await this.reactioneRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
  }

  async update(id: number, updateReactionDto: UpdateReactionDto) {
    const reaction = await this.findOne(id);
    reaction.type = updateReactionDto.type ?? reaction.type;

    return await this.reactioneRepository.save(reaction);
  }

  async remove(id: number) {
    const reaction = await this.findOne(id);

    await this.reactioneRepository.delete({ id });

    return {
      message: 'Reaction removed successfully',
    };
  }

  async findPostReaction(postId: number) {
    return await this.reactioneRepository.find({
      where: { post: { id: postId } },
    });
  }
}
