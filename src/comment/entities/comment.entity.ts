import { ReactionType } from 'src/_cors/types/ReactionType';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parentComment?: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];
}
