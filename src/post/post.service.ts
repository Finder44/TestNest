import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@/entities/Post';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@/entities/User';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async create(createPostDto: CreatePostDto, user: User) {
        const post = this.postRepository.create({ ...createPostDto, author: user });
        return this.postRepository.save(post);
    }

    findAll() {
        return this.postRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: number) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        await this.postRepository.update(id, updatePostDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const post = await this.findOne(id);
        return this.postRepository.remove(post);
    }
}
