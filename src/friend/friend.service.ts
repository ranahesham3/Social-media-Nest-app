import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { FriendRequestStatus } from 'src/_cors/types/FriendReqStatus';
import { plainToInstance } from 'class-transformer';
import { ResponseFriendRequestDto } from './dto/response-request-friend.dto';
import { FriendGateway } from './friend.gateway';
import { ResponseFriendDto } from './dto/response-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRepository: Repository<FriendRequest>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly friendGateway: FriendGateway,
  ) {}

  async sendFriendReq(userId: number, receiverId: number) {
    const sender = await this.userService.findOne(userId);
    const receiver = await this.userService.findOne(receiverId);

    if (userId == receiverId)
      throw new BadRequestException(
        'Can not send a friend request to yourself',
      );
    const previousReq = await this.friendRepository.findOne({
      where: [
        {
          sender: { id: userId },
          receiver: { id: receiverId },
        },
        {
          sender: { id: receiverId },
          receiver: { id: userId },
        },
      ],
    });
    if (previousReq && previousReq?.status === FriendRequestStatus.PENDING) {
      throw new BadRequestException('A friend request is already pending');
    } else if (
      previousReq &&
      previousReq?.status === FriendRequestStatus.ACCEPTED
    ) {
      throw new BadRequestException('You are already friends with this user');
    } else if (
      previousReq &&
      previousReq?.status === FriendRequestStatus.REJECTED
    ) {
      previousReq.status = FriendRequestStatus.PENDING;
      return await this.friendRepository.save(previousReq);
    }
    let friendRequest = this.friendRepository.create({
      sender,
      receiver,
    });

    friendRequest = await this.friendRepository.save(friendRequest);

    const response = plainToInstance(ResponseFriendRequestDto, friendRequest, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    this.friendGateway.handleSentFriendRequest(
      friendRequest.receiver.id.toString(),
      response,
    );
  }

  async cancelFriendReq(userId: number, receiverId: number) {
    const sender = await this.userService.findOne(userId);
    const receiver = await this.userService.findOne(receiverId);

    const previousReq = await this.friendRepository.findOne({
      where: {
        sender: { id: userId },
        receiver: { id: receiverId },
      },
    });
    if (!previousReq)
      throw new NotFoundException('Friend request doesn not exist');
    if (previousReq?.status === FriendRequestStatus.REJECTED) {
      throw new BadRequestException(
        'You are already canceled the friend request with this user',
      );
    } else if (previousReq?.status === FriendRequestStatus.ACCEPTED) {
      throw new BadRequestException('You are friends with this user');
    }
    previousReq.status = FriendRequestStatus.REJECTED;

    await this.friendRepository.save(previousReq);

    this.friendGateway.handleCanceledFriendRequest(
      receiverId.toString(),
      previousReq.id.toString(),
    );
  }

  async acceptFriendRequest(userId: number, id: number) {
    let friendReq = await this.findOne(id);

    if (userId !== friendReq.receiver.id) throw new ForbiddenException();

    if (friendReq?.status !== FriendRequestStatus.PENDING)
      throw new BadRequestException('request already handeled');

    friendReq.status = FriendRequestStatus.ACCEPTED;
    friendReq = await this.friendRepository.save(friendReq);

    const response = plainToInstance(ResponseFriendDto, friendReq.receiver, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    this.friendGateway.handleAcceptedFriendRequest(
      friendReq.sender.id.toString(),
      response,
      userId.toString(),
    );
  }

  async rejectFriendRequest(userId: number, id: number) {
    const friendReq = await this.findOne(id);

    if (userId !== friendReq.receiver.id) throw new ForbiddenException();

    if (friendReq?.status !== FriendRequestStatus.PENDING)
      throw new BadRequestException('request already handeled');

    friendReq.status = FriendRequestStatus.REJECTED;
    await this.friendRepository.save(friendReq);

    this.friendGateway.handleRejectedFriendRequest(
      friendReq.sender.id.toString(),
      id.toString(),
      userId.toString(),
    );
  }

  async getCurrentReqPending(senderId: number) {
    return await this.friendRepository.find({
      where: { sender: { id: senderId }, status: FriendRequestStatus.PENDING },
    });
  }

  async getCurrentFriendReq(recieverId: number) {
    return await this.friendRepository.find({
      where: {
        receiver: { id: recieverId },
        status: FriendRequestStatus.PENDING,
      },
    });
  }

  async getCurrentFriends(userId: number) {
    const friends1 = await this.friendRepository.find({
      where: {
        receiver: { id: userId },
        status: FriendRequestStatus.ACCEPTED,
      },
    });
    const friends2 = await this.friendRepository.find({
      where: {
        sender: { id: userId },
        status: FriendRequestStatus.ACCEPTED,
      },
    });
    const friends = [...friends1, ...friends2];
    return friends.map((friend) =>
      friend.receiver.id === userId ? friend.sender : friend.receiver,
    );
  }

  async findOne(id: number) {
    const friendReq = await this.friendRepository.findOneBy({ id });
    if (!friendReq)
      throw new NotFoundException('Friend request doesn not exist');
    return friendReq;
  }
}
