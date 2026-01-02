import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageGateway } from './message.gateway';
import { plainToInstance } from 'class-transformer';
import { ResponseMessageDto } from './dto/response-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageReposirory: Repository<Message>,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly messageGateway: MessageGateway,
  ) {}

  async sendMessage(
    conversationId: number,
    sendMessageDto: SendMessageDto,
    userId: number,
  ) {
    const { text, mediaFile } = sendMessageDto;
    const conversation = await this.conversationService.findOne(
      conversationId,
      userId,
    );

    let message = this.messageReposirory.create({
      sender: { id: userId },
      text,
      mediaFile,
      conversation,
      seenBy: [{ id: userId }],
    });

    message = await this.messageReposirory.save(message);

    conversation.lastMessage = message;
    await conversation.save();

    //convert the saved message into ResponseMessageDto
    const responseMessage = plainToInstance(ResponseMessageDto, message, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.messageGateway.handleNewMessage(
      conversationId.toString(),
      responseMessage,
    );

    return {
      message: 'Message sent successfully!',
    };
  }

  async getAllMessages(
    conversationId: number,
    userId: number,
    limit: number,
    pageNumber: number,
  ) {
    const conversation = await this.conversationService.findOne(
      conversationId,
      userId,
    );
    const messages = await this.messageReposirory.find({
      where: { conversation: { id: conversation.id }, isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: limit * (pageNumber - 1),
      take: limit + 1,
    });
    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, limit) : messages;

    return {
      items,
      hasNextPage,
      pageNumber,
    };
  }

  async findOne(id: number) {
    const message = await this.messageReposirory.findOne({
      where: { id, isDeleted: false },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: number, userId: number, updateMessageDto: UpdateMessageDto) {
    let message = await this.findOne(id);

    if (message?.sender.id !== userId) throw new ForbiddenException();

    message.text = updateMessageDto?.text ?? message.text;
    message.mediaFile = updateMessageDto?.mediaFile ?? message.mediaFile;

    message = await this.messageReposirory.save(message);

    //convert the saved message into ResponseMessageDto
    const responseMessage = plainToInstance(ResponseMessageDto, message, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.messageGateway.handlUpdatedMessage(
      message.conversation?.id.toString(),
      responseMessage,
    );
    return {
      message: 'Message updated successfully',
    };
  }

  async delete(id: number, userId: number) {
    let message = await this.findOne(id);

    if (message?.sender.id !== userId) throw new ForbiddenException();

    message.isDeleted = true;
    message = await this.messageReposirory.save(message);

    //convert the saved message into ResponseMessageDto
    const responseMessage = plainToInstance(ResponseMessageDto, message, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    this.messageGateway.handlDeletedMessage(
      message.conversation?.id.toString(),
      responseMessage,
    );
    return {
      message: 'Message deleted successfully',
    };
  }

  async markSeenMessage(id: number, userId: number) {
    let message = await this.findOne(id);
    const user = await this.userService.findOne(userId);
    if (!message.seenBy.find((u) => user.id === u.id)) {
      message?.seenBy.push(user);
      message = await this.messageReposirory.save(message);

      this.messageGateway.handlSeenMessage(
        message.conversation?.id.toString(),
        message.id.toString(),
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar?.url,
        },
      );
      return {
        message: 'Message marked as seen',
      };
    }
    return {
      message: 'Message already marked as seen',
    };
  }
}
