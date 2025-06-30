import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/entities/Coment';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from '@/entities/Post';
import {UserModule} from "@/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post]),
        UserModule],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
