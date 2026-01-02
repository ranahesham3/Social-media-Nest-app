import { FriendRequestStatus } from 'src/_cores/types/FriendReqStatus';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'friends' })
export class FriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    eager: true,
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    eager: true,
    onDelete: 'CASCADE',
  })
  receiver: User;

  @UpdateDateColumn()
  updatedAt: Date;
}
