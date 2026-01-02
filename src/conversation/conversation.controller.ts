import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { JwtType } from 'src/_cores/types/JwtType';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseConversationDto } from './dto/response-conversation.dto';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { RemoveParticipantsDto } from './dto/remove-participants.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('private')
  @UseGuards(AuthGuard)
  createPrivateConversation(
    @Body() createvatePrivateConversationDto: CreatePrivateConversationDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.createPrivateConversation(
      createvatePrivateConversationDto,
      payload.id,
    );
  }

  @Post('group')
  @UseGuards(AuthGuard)
  createGroupConversation(
    @Body() createvateGroupConversationDto: CreateGroupConversationDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.createGroupConversation(
      createvateGroupConversationDto,
      payload.id,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseConversationDto)
  async findAll(@CurrentUser() payload: JwtType) {
    return await this.conversationService.findAll(payload.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseConversationDto)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.findOne(id, payload.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseConversationDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConversationDto: UpdateConversationDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.update(
      id,
      updateConversationDto,
      payload.id,
    );
  }

  @Patch(':id/add-member')
  @UseGuards(AuthGuard)
  addParticipants(
    @Param('id', ParseIntPipe) id: number,
    @Body() addParticipantsDto: AddParticipantsDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.addParticipants(
      id,
      addParticipantsDto,
      payload.id,
    );
  }

  @Patch(':id/remove-member')
  @UseGuards(AuthGuard)
  removeParticipants(
    @Param('id', ParseIntPipe) id: number,
    @Body() removeParticipantsDto: RemoveParticipantsDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.conversationService.removeParticipants(
      id,
      removeParticipantsDto,
      payload.id,
    );
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return await this.conversationService.remove(id, payload.id);
  }
}
