//для установки ролей пользователя
//ключ для хранения метаданных ролей
import {UserRole} from "@/entities/enums";
import {SetMetadata} from "@nestjs/common";

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[])=> SetMetadata(ROLES_KEY,roles)