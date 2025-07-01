import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Delete,
    UseGuards,
    Req, UnauthorizedException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Request } from 'express';

@Controller('posts/:postId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}


    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Param('postId') postId: number,
        @Body() dto: CreateCommentDto,
        @Req() req: Request
    ) {
        if (!req.user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }
        return this.commentService.create(+postId, dto, req.user);
    }




    @Get()
    async findAll(@Param('postId') postId: number) {
        return this.commentService.findAll(+postId);
    }


    @UseGuards(AuthGuard)
    @Delete(':commentId')
    async delete(
        @Param('commentId') commentId: number,
        @Req() req: Request
    ) {
        if (!req.user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }
        return this.commentService.delete(+commentId, req.user);
    }

}
