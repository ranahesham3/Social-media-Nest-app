import { ReactionType } from 'src/_cores/types/ReactionType';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reaction' })
export class Reaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  // @ManyToOne(() => Comment, (comment) => comment.post, {
  //   eager: true,
  //   onDelete: 'CASCADE',
  // })
  // comments: Comment[];
}
