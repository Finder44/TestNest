import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/entities/Coment';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from '@/entities/Post';
import { User } from '@/entities/User';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepo: Repository<Comment>,
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
    ) {}

    async create(postId: number, dto: CreateCommentDto, user: User): Promise<Comment> {
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Пост не найден');

        const comment = this.commentRepo.create({
            content: dto.content,
            post,
            user,
        });

        return this.commentRepo.save(comment);
    }

    async findAll(postId: number): Promise<Comment[]> {
        return this.commentRepo.find({
            where: { post: { id: postId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async delete(commentId: number, user: User): Promise<void> {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) throw new NotFoundException('Комментарий не найден');

        if (comment.user.id !== user.id) {
            throw new Error('Вы не можете удалить этот комментарий');
        }

        await this.commentRepo.delete(commentId);
    }
}
