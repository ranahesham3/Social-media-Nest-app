import { NotificationType } from 'src/_cors/types/NotificationType';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'notifiactions' })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  content: string;

  @Column({ default: false })
  isReed: boolean;

  @Column({ nullable: true })
  targetId?: number;

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
}
