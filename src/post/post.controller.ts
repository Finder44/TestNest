import {
    Controller, Get, Post as HttpPost, Body,
    Patch, Param, Delete, UseGuards, Req
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import {CurrentUser} from "@/post/decorators/current-user.decorator";
import {User} from "@/entities/User";


@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @HttpPost()
    @UseGuards(AuthGuard)
    public async create(@Body() dto: CreatePostDto, @CurrentUser() user: User){
        return this.postService.create(dto, user);
    }

    @Get()
    public async findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    public async findOne(@Param('id') id: string) {
        return this.postService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.postService.update(+id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    public async remove(@Param('id') id: string) {
        return this.postService.remove(+id);
    }
}
