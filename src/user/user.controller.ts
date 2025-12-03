import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Post,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/_cors/guards/auth.guard';
import { TransformDTO } from 'src/_cors/interceptors/transform-dto.interceptor';
import { CurrentUser } from 'src/_cors/decorators/current-user.decorator';
import type { JwtType } from 'src/_cors/types/JwtType';
import { ResponseUserDto } from './dto/response-user.dto';
import { Roles } from 'src/_cors/decorators/role.decorator';
import { UserType } from 'src/_cors/types/userType';
import { RoleGuard } from 'src/_cors/guards/role.guard';
import { UploadMediaDto } from 'src/_cors/dtos/upload-media.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseUserDto)
  async getCurrentUser(@CurrentUser() payload: JwtType) {
    return await this.userService.getCurrentUser(payload.id);
  }

  @Post('/upload-avatar')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseUserDto)
  async uploadAvatar(
    @CurrentUser() payload: JwtType,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return await this.userService.uploadAvatar(payload.id, uploadMediaDto);
  }

  @Post('/upload-cover-photo')
  @UseGuards(AuthGuard)
  @TransformDTO(ResponseUserDto)
  async uploadCoverPhoto(
    @CurrentUser() payload: JwtType,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return await this.userService.uploadCoverPhoto(payload.id, uploadMediaDto);
  }

  @Get('')
  @Roles(UserType.ADMIN)
  @UseGuards(RoleGuard)
  @TransformDTO(ResponseUserDto)
  async getAllUser(
    @Query('q') q: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('cursor', new DefaultValuePipe(1), ParseIntPipe) cursor: number,
  ) {
    return await this.userService.findAll(q, limit, cursor);
  }

  @Roles(UserType.NORMAL_USER, UserType.ADMIN)
  @UseGuards(RoleGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @TransformDTO(ResponseUserDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deactive(id);
  }
}
