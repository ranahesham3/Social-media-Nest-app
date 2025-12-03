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
  HttpCode,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthGuard } from 'src/_cors/guards/auth.guard';
import { CurrentUser } from 'src/_cors/decorators/current-user.decorator';
import type { JwtType } from 'src/_cors/types/JwtType';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { ResponseFriendDto } from './dto/response-friend.dto';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @HttpCode(200)
  @Post('request/:recieverId')
  @UseGuards(AuthGuard)
  async sendFriendReqest(
    @CurrentUser() payload: JwtType,
    @Param('recieverId', ParseIntPipe) recieverId: number,
  ) {
    return await this.friendService.sendFriendReq(payload.id, recieverId);
  }

  @HttpCode(200)
  @Post('cancel-request/:recieverId')
  @UseGuards(AuthGuard)
  async cancelFriendReqest(
    @CurrentUser() payload: JwtType,
    @Param('recieverId', ParseIntPipe) recieverId: number,
  ) {
    return await this.friendService.cancelFriendReq(payload.id, recieverId);
  }

  @HttpCode(200)
  @Post('accept-request/:id')
  @UseGuards(AuthGuard)
  async acceptFriendReqest(
    @CurrentUser() payload: JwtType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendService.acceptFriendRequest(payload.id, id);
  }

  @HttpCode(200)
  @Get('reject-request/:id')
  @UseGuards(AuthGuard)
  async rejectFriendReqest(
    @CurrentUser() payload: JwtType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendService.rejectFriendRequest(payload.id, id);
  }

  @Get('pending-requests')
  @UseGuards(AuthGuard)
  async getCurrentReqestsPending(@CurrentUser() payload: JwtType) {
    return await this.friendService.getCurrentReqPending(payload.id);
  }

  @Get('friend-requests')
  @UseGuards(AuthGuard)
  async getCurrentFriendReqests(@CurrentUser() payload: JwtType) {
    return await this.friendService.getCurrentFriendReq(payload.id);
  }

  @Get('current-friends')
  @TransformDTO(ResponseFriendDto)
  @UseGuards(AuthGuard)
  async getCurrentFriends(@CurrentUser() payload: JwtType) {
    return await this.friendService.getCurrentFriends(payload.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }
}
