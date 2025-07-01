import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';

import { User } from './User';

@Entity({ name: 'accounts' })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'provider_account_id', nullable: false })
    providerAccountId!: string;

    @Column()
    type!: string;

    @Column()
    provider!: string;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken?: string;

    @Column({ name: 'access_token', nullable: true })
    accessToken?: string;

    @Column({ name: 'expires_at', type: 'int' })
    expiresAt!: number;

    @CreateDateColumn({ name: 'created-at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated-at' })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.accounts, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ name: 'user_id', nullable: true })
    userId?: string;
}
