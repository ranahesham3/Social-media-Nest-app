import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageGateway } from './message.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    UserModule,
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
