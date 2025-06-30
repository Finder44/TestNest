import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/Post';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {User} from "@/entities/User";
import {UserModule} from "@/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Post,User]),
    UserModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
