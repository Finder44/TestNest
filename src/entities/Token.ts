import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
} from 'typeorm';

import { TokenType } from './enums';


@Entity({ name: 'tokens' })
@Unique(['email'])
@Unique(['token'])
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column()
    token!: string;

    @Column({ type: 'enum', enum: TokenType })
    type!: TokenType;

    @Column({ name: 'expires_in', type: 'timestamp' })
    expiresIn!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
