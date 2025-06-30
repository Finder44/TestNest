//настройка куки вроде как закончена
//npm run start:dev
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import IORedis from 'ioredis';
import {ValidationPipe} from '@nestjs/common';
import * as session from 'express-session';
import {ms, StringValue} from "@/libs/common/utils/ms.util";
import {parseBoolean} from "@/libs/common/utils/parse-boolean.util";
import {RedisStore} from "connect-redis";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);
    const redis = new IORedis(config.getOrThrow('REDIS_URI'));// Настраиваем Redis-клиент

    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));//Cookie parser

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true, // Автоматически удаляет поля, которых нет в DTO
            forbidNonWhitelisted: true, // Выбрасывает ошибку, если лишние поля
        })
    );

    app.use(
        session({
            secret: config.getOrThrow<string>('SESSION_SECRET'),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: true,//нужно ли сохранять сессию даже если она небыла изменена (указал нужно)
            saveUninitialized: false, //нужно ли сохранять не инициализированные сессии
            cookie: {
                domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
                httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
                secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
                sameSite: 'lax'
            },
            store: new RedisStore({
                client: redis,
                prefix: config.getOrThrow<string>('SESSION_FOLDER')//префикс для ключей сессий в редис SESSION_FOLDER папка для хранения сессий
            })
        })
    )

    app.enableCors({
        origin: config.getOrThrow<string>('APPLICATION_ORIGIN'),
        credentials: true,
        exposedHeaders: ['set-cookie'],
    })


    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
