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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/_cors/guards/auth.guard';
import { CurrentUser } from 'src/_cors/decorators/current-user.decorator';
import type { JwtType } from 'src/_cors/types/JwtType';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { ResponsePostDto } from './dto/response-post.dto';
import { Roles } from 'src/_cors/decorators/role.decorator';
import { UserType } from 'src/_cors/types/userType';
import { RoleGuard } from 'src/_cors/guards/role.guard';
import { UploadMediaDto } from '../_cors/dtos/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ResponsePostReactionDto } from './dto/response-post-reaction.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @TransformDTO(ResponsePostDto)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() payload: JwtType,
  ) {
    return this.postService.create(createPostDto, payload.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @TransformDTO(ResponsePostDto)
  findAll(
    @CurrentUser() payload: JwtType,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe)
    pageNumber: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.postService.findAll(payload.id, limit, pageNumber, cursor);
  }

  // @Get(':id')
  // @TransformDTO(ResponsePostDto)
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.postService.findOne(id);
  // }
  @Get(':id/reactions')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponsePostReactionDto)
  findPostReaction(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findPostReaction(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponsePostDto)
  findOneWithMyReaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return this.postService.findOneWithMyReaction(id, payload.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @TransformDTO(ResponsePostDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/upload-media')
  @TransformDTO(ResponsePostDto)
  uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @Body() uploadMediaDtos: UploadMediaDto[],
  ) {
    return this.postService.uploadMedia(id, uploadMediaDtos);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/delete-media')
  @TransformDTO(ResponsePostDto)
  deleteMedia(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteMediaDto: DeleteMediaDto,
  ) {
    return this.postService.removeMedia(id, deleteMediaDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/reaction')
  @TransformDTO(ResponsePostDto)
  addReaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
    @Body() addReactionDto: AddReactionDto,
  ) {
    return this.postService.addReaction(id, payload.id, addReactionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/reaction')
  @TransformDTO(ResponsePostDto)
  removeReaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JwtType,
  ) {
    return this.postService.removeReaction(id, payload.id);
  }
}
