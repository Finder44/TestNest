import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {User} from './entities/User'
import {Account} from './entities/Account'
import {Token} from './entities/Token'

import {IS_DEV_ENV} from "./libs/common/utils/is-dev.util";
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import { ProviderModule } from '@/auth/provider/provider.module';
import {Post} from "@/entities/Post";
import {PostModule} from "@/post/post.module";
import {Comment} from "@/entities/Coment";
import {CommentModule} from "@/coments/comment.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('POSTGRES_URI'),
                entities: [User, Account, Token,Post, Comment],
                synchronize: true,
                logging: IS_DEV_ENV,
            }),
        }),
        AuthModule,
        UserModule,
        ProviderModule,
        PostModule,
        CommentModule,
    ],

    controllers: [],
    providers: [],
})
export class AppModule {
}
