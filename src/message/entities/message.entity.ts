import { MediaType } from 'src/_cores/types/MediaType';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column({ type: 'simple-json', nullable: true })
  mediaFile?: MediaType;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  seenBy: User[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  conversation: Conversation;
}
