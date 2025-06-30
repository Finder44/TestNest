import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from "typeorm";

import {User} from '@/entities/User'
import {AuthMethod} from "@/entities/enums";
import * as argon2 from "argon2";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    public async findById(id: string) {
        const user = await this.userRepository.findOne(
            {
                where: {id},
                relations: ['accounts'],
            })
        if (!user) {
            throw new NotFoundException(`User with this ${id} not found`);
        }
        return user;
    }

    public async findByEmail(email: string) {
        const user = await this.userRepository.findOne(
            {
                where: {email},
                relations: ['accounts'],
            })
        return user;
    }

    public async create(
        email: string,
        password: string,
        displayName: string,
        picture: string,
        method: AuthMethod,
        isVerified: boolean,
    ) {
        let hashedPassword = ''
        if (password) {
            hashedPassword = await argon2.hash(password);
        }

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            displayName,
            picture,
            method,
            isVerified,
        })
        const savedUser = await this.userRepository.save(user);

        // чтобы получить связанные accounts:
        const userWithAccounts = await this.userRepository.findOne({
            where: {id: savedUser.id},
            relations: ['accounts'],
        })
        return userWithAccounts;
    }
}
