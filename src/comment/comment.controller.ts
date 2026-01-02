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
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { JwtType } from 'src/_cores/types/JwtType';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { UserType } from 'src/_cores/types/userType';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseCommentDto)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.commentService.create(createCommentDto, payload.id);
  }

  @Get('post/:postId')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseCommentDto)
  findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.getComments(postId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(UserType.NORMAL_USER)
  @TransformDTO(ResponseCommentDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
