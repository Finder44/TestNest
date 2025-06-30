import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {RegisterDto} from "@/auth/dto/register.dto";
import {UserService} from "@/user/user.service";
import {AuthMethod} from "@/entities/enums";
import {User} from "@/entities/User";
import {Request, Response} from "express";
import {LoginDto} from "@/auth/dto/login.dto";
import {verify} from "argon2";
import {useRef} from "react";
import {ConfigService} from "@nestjs/config";
import {ProviderService} from "@/auth/provider/provider.service";
import {Repository} from "typeorm";
import {Account} from "@/entities/Account";
import {InjectRepository} from "@nestjs/typeorm";


@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,) {
    }

    public async register(req: Request, dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if (isExists) {
            throw new ConflictException('Email already exists')
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )
        return this.saveSession(req, newUser!)
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)

        if (!user || !user.password) {
            throw new NotFoundException('Пользователь не найден. Пожалуйста , проверьте введенные данные ')
        }

        const isValidPassword = await verify(user.password, dto.password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный пароль.Пожалуйста, попробуйте еще раз' +
                'или восстановите пароль если забыли его.')
        }
        return this.saveSession(req, user)
    }

    public async extractProfileFromCode(req: Request, provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider);

        const profile = await providerInstance?.findUserByCode(code);
        if (!profile) {
            throw new InternalServerErrorException('Не удалось получить профиль пользователя от провайдера');
        }

        const providerKey = profile.provider.toUpperCase();
        if (!(providerKey in AuthMethod)) {
            throw new Error(`Unsupported provider: ${profile.provider}`);
        }

        const method = AuthMethod[providerKey as keyof typeof AuthMethod];

        const account = await this.accountRepository.findOne({
            where: {
                providerAccountId: profile.id,
                provider: profile.provider,
            },
        });

        let user: User | null = null;


        if (account?.userId) {
            user = await this.userService.findById(account.userId);
        }


        if (!user) {
            user = await this.userService.findByEmail(profile.email);
        }


        if (!user) {
            user = await this.userService.create(
                profile.email,
                '',
                profile.name,
                profile.picture,
                method,
                true
            );

            if (!user) {
                throw new InternalServerErrorException('Пользователь не был создан');
            }
        }
        console.log("Prof " , profile)
        if (!account) {
            await this.accountRepository.save(
                this.accountRepository.create({
                    providerAccountId: profile.id,
                    userId: user.id,
                    type: 'oauth',
                    provider: profile.provider,
                    accessToken: profile.access_token ?? undefined,
                    refreshToken: profile.refresh_token ?? undefined,
                    expiresAt: profile.expires_at ?? 0,
                })
            );
        }

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(new InternalServerErrorException('Не удалось завершить сессию.' +
                        'Возможно , возникла проблема с сервером или сессия уже была завершена.'));
                }
                res.clearCookie('session');
                resolve();
            })
        })
    }

    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию. Проверьте ,правильно ли настроены параметры сессии'
                        )
                    );
                }
                resolve({
                    user
                })
            })
        })
    }
}
