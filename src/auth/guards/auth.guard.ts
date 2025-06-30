import {Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {UserRole} from "@/entities/enums";
import {ROLES_KEY} from "@/auth/decorators/roles.decorator";
import {UserService} from "@/user/user.service";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(private readonly UserService: UserService) {
    }

    public async canActivate(context: ExecutionContext,): Promise<boolean> {

        const request = context.switchToHttp().getRequest() ;


        if (typeof request.session.userId === 'undefined'){//есть ли .зер айди в сессии
            throw new UnauthorizedException('Пользователь не авторизован. Пожалуйста ,войдите в систему, чтобы получить доступ.')
        }

        const user = await this.UserService.findById(request.session.userId);

        request.user = user;

        return true
    }
}
