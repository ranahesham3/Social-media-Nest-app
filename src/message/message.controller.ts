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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/_cors/guards/auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from 'src/_cors/decorators/current-user.decorator';
import type { JwtType } from 'src/_cors/types/JwtType';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { ResponseMessageDto } from './dto/response-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('conversation/:conversationId')
  @UseGuards(AuthGuard)
  async sendMessage(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() body: SendMessageDto,
    @CurrentUser() payload: JwtType,
  ) {
    return await this.messageService.sendMessage(
      conversationId,
      body,
      payload.id,
    );
  }

  @Get('conversation/:conversationId')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseMessageDto)
  async getAllMessages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @CurrentUser() payload: JwtType,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('cursor', new DefaultValuePipe(1), ParseIntPipe) cursor: number,
  ) {
    return await this.messageService.getAllMessages(
      conversationId,
      payload.id,
      limit,
      cursor,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messageService.update(id, payload.id, updateMessageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return await this.messageService.delete(id, payload.id);
  }

  @Patch(':id/seen')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseMessageDto)
  async markSeenMessage(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return await this.messageService.markSeenMessage(id, payload.id);
  }
}
