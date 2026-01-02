import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { CommentGateway } from './comment.gateway';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly commentGateway: CommentGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { postId, parentCommentId, content } = createCommentDto;
    const post = await this.postService.findOne(postId);
    const author = await this.userService.findOne(userId);
    let parentComment: Comment | null = null;
    if (parentCommentId) {
      const foundParent = await this.commentRepository.findOne({
        where: {
          id: parentCommentId,
        },
        //to load more than 1 parent becaure eager load only 1 leavel
        relations: ['parentComment'],
      });
      if (!foundParent) throw new NotFoundException('Parent comment not found');
      parentComment = foundParent.parentComment ?? foundParent;
    }
    let comment = this.commentRepository.create({
      content,
      post,
      parentComment: parentComment,
      author,
    });
    comment = await this.commentRepository.save(comment);

    const responseComment = plainToInstance(ResponseCommentDto, comment, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.commentGateway.handleNewComment(responseComment);

    return {
      message: 'Comment created successfully!',
    };
  }

  async getComments(postId: number) {
    await this.postService.findOne(postId);
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['replies', 'parentComment'],
    });
    return comments.filter((comment) => comment.parentComment == null);
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('CommentNotFound');
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    let comment = await this.findOne(id);
    comment.content = updateCommentDto.content;
    comment = await this.commentRepository.save(comment);

    this.commentGateway.handleUpdatedComment(
      id,
      comment.content,
      comment.updatedAt,
    );

    return {
      message: 'Comment updated successfully!',
    };
  }

  async remove(id: number) {
    const comment = await this.findOne(id);
    await this.commentRepository.delete(id);

    this.commentGateway.handledeletedComment(
      comment.id,
      comment.parentComment?.id,
    );

    return {
      message: 'Comment deleted successfully',
    };
  }
}
