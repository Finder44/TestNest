import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { Account } from './src/entities/Account';
import { Token } from './src/entities/Token';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.POSTGRES_URI, // или `host`, `username`, `password` по отдельности
    synchronize: true,             // Только в dev, не включай в продакшене!
    logging: false,
    entities: [User, Account, Token],
    migrations: [],
    subscribers: [],
});
