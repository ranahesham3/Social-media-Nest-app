import { MediaType } from 'src/_cors/types/MediaType';
import { PrivacyType } from 'src/_cors/types/PrivacyType';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
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

@Entity({ name: 'post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  mediaFiles: MediaType[] = [];

  @Column({ type: 'enum', enum: PrivacyType, default: PrivacyType.PUBLIC })
  privacy: PrivacyType;

  @Column({ default: '#fff' })
  backgroundColour: string;

  @Column({
    type: 'jsonb',
    default: () => `'{"love":0,"like":0,"haha":0,"angry":0,"wow":0,"sad":0}'`,
  })
  reactionCounts: {
    love: number;
    like: number;
    haha: number;
    angry: number;
    wow: number;
    sad: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
