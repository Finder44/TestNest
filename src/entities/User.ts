import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Account } from './Account';
import { UserRole, AuthMethod } from './enums'; //  enum'ы в отдельном файле
import {Comment} from "@/entities/Coment";


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({type: 'varchar',nullable: true})
    password!: string| null;

    @Column()
    displayName!: string;

    @Column({ nullable: true })
    picture?: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.REGULAR })
    role!: UserRole;

    @Column({ name: 'is_verified', default: false })
    isVerified!: boolean;

    @Column({ name: 'is_two_factor_enable', default: false })
    isTwoFactorEnable!: boolean;

    @Column({ type: 'enum', enum: AuthMethod })
    method!: AuthMethod;

    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[];

    @CreateDateColumn({ name: 'created-at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated-at' })
    updatedAt!: Date;


    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];


    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];
}
