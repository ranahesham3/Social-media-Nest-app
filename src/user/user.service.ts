import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UploadMediaDto } from 'src/_cors/dtos/upload-media.dto';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,
  ) {}

  async getCurrentUser(id: number) {
    const user = await this.userRepository.findOneBy({ id, isActive: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(
    currentUserId: number,
    q: string,
    limit: number,
    cursor: number,
  ) {
    const userFriends =
      await this.friendService.getCurrentFriends(currentUserId);
    const userFriendIds = userFriends.map((fr) => fr.id);

    const db = this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive=true')
      .orderBy('user.name', 'ASC');
    if (q) {
      db.andWhere(`user.name ILIKE :q OR user.email ILIKE :q`, { q: `%${q}%` });
    }
    db.skip((cursor - 1) * limit).take(limit);
    const users = await db.getMany();

    return users.map((u) => ({
      ...u,
      isFriend: userFriendIds.includes(u.id),
    }));
  }

  async findByIds(userIds: number[]) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.id IN (:...ids)`, { ids: userIds })
      .getMany();

    if (users.length !== userIds.length)
      throw new NotFoundException('User Not Found');
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id, isActive: true });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, bio, birthday, phoneNumber } = updateUserDto;
    let user = await this.findOne(id);
    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.birthday = birthday ?? user.birthday;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;

    user = await this.userRepository.save(user);
    return user;
  }

  async deactive(id: number) {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
    return {
      message: 'User decativaed successfully',
    };
  }

  async uploadAvatar(id: number, uploadMediaDto: UploadMediaDto) {
    const user = await this.findOne(id);

    user.avatar = uploadMediaDto;
    return await this.userRepository.save(user);
  }

  async uploadCoverPhoto(id: number, uploadMediaDto: UploadMediaDto) {
    const user = await this.findOne(id);

    user.coverPhoto = uploadMediaDto;
    return await this.userRepository.save(user);
  }
}
