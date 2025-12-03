import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { UserService } from 'src/user/user.service';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { Message } from 'src/message/entities/message.entity';
import { NotFoundError } from 'rxjs';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { User } from 'src/user/entities/user.entity';
import { RemoveParticipantsDto } from './dto/remove-participants.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UserService,
  ) {}
  async createPrivateConversation(
    createPrivateConversationDto: CreatePrivateConversationDto,
    currentUserId: number,
  ) {
    const sender = await this.userService.findOne(currentUserId);
    const receiver = await this.userService.findOne(
      createPrivateConversationDto.participantId,
    );
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.participants', 'participant')
      .where('participant.id = :senderId', { senderId: sender.id })
      .andWhere('participant.id = :receiverId', { receiverId: receiver.id })
      .groupBy('conversation.id')
      .having('conversation.isGroup=false')
      .getOne();

    if (existingConversation) return existingConversation;

    const conversation = this.conversationRepository.create({
      isGroup: false,
      participants: [sender, receiver],
    });

    return await this.conversationRepository.save(conversation);
  }

  async createGroupConversation(
    createGroupConversationDto: CreateGroupConversationDto,
    currentUserId: number,
  ) {
    const { groupAvatar, groupName, participantsId } =
      createGroupConversationDto;
    const groupOwner = await this.userService.findOne(currentUserId);
    const participants = await this.userService.findByIds(participantsId);

    const group = this.conversationRepository.create({
      isGroup: true,
      groupOwner,
      groupName,
      groupAvatar,
      participants: [groupOwner, ...participants],
    });

    return await this.conversationRepository.save(group);
  }

  async findAll(userId: number) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.participants',
        'participant',
        'participant.id = :userId',
        { userId },
      )
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('conversation.groupOwner', 'groupOwner')
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();

    return conversations;
  }

  async findOne(id: number, userId: number) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.participants',
        'participant',
        'participant.id = :userId',
        { userId },
      )
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('conversation.groupOwner', 'groupOwner')
      .where('conversation.id= :id', { id })
      .getOne();

    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async update(
    id: number,
    updateConversationDto: UpdateConversationDto,
    userId: number,
  ) {
    const { groupAvatar, groupName } = updateConversationDto;
    const conversation = await this.conversationRepository.findOneBy({
      id,
      isGroup: true,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.groupOwner?.id !== userId)
      throw new UnauthorizedException(`You 're not the group owner`);

    conversation.groupName = groupName ?? conversation.groupName;
    conversation.groupAvatar = groupAvatar ?? groupAvatar;

    return await this.conversationRepository.save(conversation);
  }

  async addParticipants(
    id: number,
    addParticipantsDto: AddParticipantsDto,
    userId: number,
  ) {
    const { participantsIds } = addParticipantsDto;
    const conversation = await this.conversationRepository.findOneBy({
      id,
      isGroup: true,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.groupOwner?.id !== userId)
      throw new UnauthorizedException(`You 're not allowed to add members`);
    const existingParticipants = conversation.participants.map(
      (p: User) => p.id,
    );
    const addedParticipants = participantsIds.filter((p: number) => {
      return !existingParticipants.includes(p);
    });
    const participants = await this.userService.findByIds(addedParticipants);
    conversation.participants.push(...participants);
    await this.conversationRepository.save(conversation);
    return {
      message: 'Members added successfully',
    };
  }

  async removeParticipants(
    id: number,
    removeParticipantsDto: RemoveParticipantsDto,
    userId: number,
  ) {
    const { participantsIds } = removeParticipantsDto;
    const conversation = await this.conversationRepository.findOneBy({
      id,
      isGroup: true,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.groupOwner?.id !== userId)
      throw new UnauthorizedException(`You 're not allowed to remove members`);
    if (participantsIds.includes(conversation.groupOwner.id))
      throw new BadRequestException(`Group owner can't be removed`);

    const existingParticipants = conversation.participants.map(
      (p: User) => p.id,
    );
    const removedParticipants = participantsIds.filter((p: number) => {
      return existingParticipants.includes(p);
    });
    if (participantsIds.length !== removedParticipants.length)
      throw new NotFoundException('User not found');
    await this.userService.findByIds(removedParticipants);

    conversation.participants = conversation.participants.filter(
      (p) => !participantsIds.includes(p.id),
    );
    await this.conversationRepository.save(conversation);

    return {
      message: 'Members removed successfully',
    };
  }

  async remove(id: number, userId: number) {
    const conversation = await this.conversationRepository.findOneBy({
      id,
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.isGroup && conversation.groupOwner?.id !== userId)
      throw new UnauthorizedException(
        `You 're not allowed to remove this group`,
      );

    await this.conversationRepository.delete(conversation.id);
    return {
      message: 'Conversation deleted successfully',
    };
  }
}
