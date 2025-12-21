import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, LessThan, Or, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UploadMediaDto } from '../_cors/dtos/upload-media.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MediaType } from 'src/_cors/types/MediaType';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { PostGateway } from './post.gateway';
import { ResponsePostDto } from './dto/response-post.dto';
import { plainToInstance } from 'class-transformer';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/_cors/types/NotificationType';
import { PrivacyType } from 'src/_cors/types/PrivacyType';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly reactionService: ReactionService,
    private readonly notificationService: NotificationService,
    private readonly postGateway: PostGateway,
    private readonly friendService: FriendService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number) {
    const user = await this.userRepository.findOneBy({ id: authorId });
    if (!user) throw new UnauthorizedException('Try to login again');

    let newPost = this.postRepository.create({
      ...createPostDto,
      author: user,
    });

    newPost = await this.postRepository.save(newPost);

    const responsePost = plainToInstance(ResponsePostDto, newPost, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.postGateway.handleNewPost(responsePost);
  }

  async findAll(
    userId: number,
    limit: number,
    pageNumber: number,
    cursor?: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Try to login again');

    const friendsOfAuthor = await this.friendService.getCurrentFriends(userId);
    const friendsOfAuthorIds = friendsOfAuthor.map((fr) => fr.id);

    const skip = (pageNumber - 1) * limit;
    const posts = await this.postRepository.find({
      where: [
        {
          ...(cursor ? { createdAt: LessThan(new Date(cursor)) } : {}),
          privacy: PrivacyType.PUBLIC,
        },
        {
          ...(cursor ? { createdAt: LessThan(new Date(cursor)) } : {}),
          privacy: PrivacyType.FRIENDS,
          author: { id: In(friendsOfAuthorIds) },
        },
        {
          ...(cursor ? { createdAt: LessThan(new Date(cursor)) } : {}),
          privacy: PrivacyType.PRIVATE,
          author: { id: userId },
        },
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    const postsWithReaction = Promise.all(
      posts.map(async (post) => {
        const currentReaction = await this.reactionService.findExisting(
          post.id,
          userId,
        );

        return { ...post, myReaction: currentReaction?.type };
      }),
    );
    return postsWithReaction;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findPostReaction(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    const reactions = await this.reactionService.findPostReaction(id);

    return reactions;
  }

  async findOneWithMyReaction(id: number, currentUserId: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    const currentReaction = await this.reactionService.findExisting(
      id,
      currentUserId,
    );

    return { ...post, myReaction: currentReaction?.type };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let post = await this.findOne(id);
    post.backgroundColour =
      updatePostDto.backgroundColour ?? post.backgroundColour;
    post.content = updatePostDto.content ?? post.content;
    post.privacy = updatePostDto.privacy ?? post.privacy;

    post = await this.postRepository.save(post);

    const response: UpdatePostDto = {
      backgroundColour: post.backgroundColour,
      content: post.content,
      privacy: post.privacy,
    };
    this.postGateway.handleUpdatedPost(post.id, response);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepository.delete({ id });

    this.postGateway.handleDeletedPost(post.id);

    return {
      message: 'Post deleted successfully',
    };
  }

  //--------------------------------Media----------------------------------------

  async uploadMedia(id: number, uploadMediaDtos: UploadMediaDto[]) {
    const post = await this.findOne(id);
    if (uploadMediaDtos?.length)
      post.mediaFiles = [...post.mediaFiles, ...uploadMediaDtos];

    await this.postRepository.save(post);
    this.postGateway.handleUploadedMedia(post.id, uploadMediaDtos);
  }

  async removeMedia(id: number, deleteMediaDto: DeleteMediaDto) {
    const post = await this.findOne(id);
    post.mediaFiles = post.mediaFiles.filter(
      (media: MediaType) => media.public_id !== deleteMediaDto.mediaId,
    );

    await this.postRepository.save(post);
    this.postGateway.handleDeletedMedia(post.id, deleteMediaDto);
  }

  //--------------------------------Reaction-------------------------------------
  async addReaction(
    id: number,
    userId: number,
    addReactionDto: AddReactionDto,
  ) {
    const { reactionType } = addReactionDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Try to login again');

    let post = await this.findOne(id);

    const previousReaction = await this.reactionService.findExisting(
      id,
      userId,
    );

    if (previousReaction) {
      post.reactionCounts[previousReaction.type]--;
      console.log(
        previousReaction.type != reactionType,
        previousReaction.type,
        reactionType,
      );
      if (previousReaction.type != reactionType)
        await this.reactionService.update(previousReaction.id, {
          type: reactionType,
        });
      else {
        await this.reactionService.remove(previousReaction.id);
        post.reactionCounts[reactionType]--;
      }
    } else {
      await this.reactionService.create({ reactionType, postId: id, userId });
    }
    post.reactionCounts[reactionType]++;

    post = await this.postRepository.save(post);

    const responsePost = plainToInstance(ResponsePostDto, post, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.postGateway.handleAddReaction(responsePost);

    const notificationContent = `${user.name ?? 'User'} has added ${reactionType} reaction to your post`;
    await this.notificationService.create(
      userId,
      post.author.id,
      NotificationType.REACTION,
      notificationContent,
      post.id,
    );
  }

  async removeReaction(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Try to login again');

    let post = await this.findOne(id);

    const previousReaction: Reaction | null =
      await this.reactionService.findExisting(id, userId);
    if (!previousReaction) return;

    post.reactionCounts[previousReaction.type]--;
    await this.reactionService.remove(previousReaction.id);

    post = await this.postRepository.save(post);

    const responsePost = plainToInstance(ResponsePostDto, post, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.postGateway.handleAddReaction(responsePost);
  }
}
