import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/entities/User";

@Module({
  imports: [TypeOrmModule.forFeature([User])], //регистрируем репозиторий
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService,TypeOrmModule],//чтобы другие модули могли использовать
})
export class UserModule {}
