import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Post } from '@/entities/Post';
import { User } from '@/entities/User';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post!: Post;

    @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
    user!: User;
}
