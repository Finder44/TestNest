import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserService} from "@/user/user.service";
import {UserModule} from "@/user/user.module";
import {GoogleRecaptchaModule} from "@nestlab/google-recaptcha";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getRecaptchaCofig} from "@/config/recaptcha.config";
import {ProviderModule} from "@/auth/provider/provider.module";
import {getProvidersConfig} from "@/config/providers.config";
import {Account} from "@/entities/Account";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      TypeOrmModule.forFeature([Account]),
      ProviderModule.registerAsync({
          imports: [ConfigModule,],
          useFactory: getProvidersConfig,
          inject: [ConfigService],
      }),
      UserModule,
      GoogleRecaptchaModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: getRecaptchaCofig,
        inject: [ConfigService],
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService],
})
export class AuthModule {}
