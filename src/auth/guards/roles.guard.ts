import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {UserRole} from "@/entities/enums";
import {ROLES_KEY} from "@/auth/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector) {
    }

    public async canActivate(context: ExecutionContext,): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),//получуние метаданных о метода контроллера
            context.getClass()//получение метаданных из класса контроллера
        ]);

        const request = context.switchToHttp().getRequest();

        if (!roles) {
            return true
        }

        if (!roles.includes(request.user.role)) {//нет роли пользователя
            throw new ForbiddenException('Недостаточно прав. У вас нет прав для доступа к этому ресурчу')
        }

        return true

    }
}
