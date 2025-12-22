import { MediaType } from 'src/_cors/types/MediaType';
import { ReactionType } from 'src/_cors/types/ReactionType';
import { Message } from 'src/message/entities/message.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'conversation' })
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isGroup: boolean;

  @Column({ type: 'simple-json', nullable: true })
  groupAvatar?: MediaType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  groupName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.groups, {
    eager: true,
    onDelete: 'CASCADE',
  })
  groupOwner?: User;

  @ManyToMany(() => User, (user) => user.conversations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToOne(() => Message, { nullable: true, eager: true })
  @JoinColumn()
  lastMessage: Message;
}
