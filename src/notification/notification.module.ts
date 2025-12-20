import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
