import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend.entity';
import { UserModule } from 'src/user/user.module';
import { FriendGateway } from './friend.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UserModule],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway],
})
export class FriendModule {}
