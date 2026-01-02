import { Exclude } from 'class-transformer';
import { MediaType } from 'src/_cores/types/MediaType';
import { UserType } from 'src/_cores/types/userType';
import { Comment } from 'src/comment/entities/comment.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';
import { Message } from 'src/message/entities/message.entity';
import { Post } from 'src/post/entities/post.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.NORMAL_USER,
  })
  role: UserType;

  @Column({ type: 'varchar', length: 30, nullable: true })
  bio?: string;

  @Column({ type: 'simple-json', nullable: true })
  avatar?: MediaType;

  @Column({ type: 'simple-json', nullable: true })
  coverPhoto?: MediaType;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber?: string;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn({})
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => FriendRequest, (friend) => friend.receiver)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friend) => friend.sender)
  sentFriendRequests: FriendRequest[];

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  conversations: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.groupOwner)
  groups: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
