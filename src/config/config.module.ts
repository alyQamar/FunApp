import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Database } from './providers/database';
import envOptions from '@config/envs/env.option';
@Module({
    imports: [
        ConfigModule.forRoot(envOptions()),
        TypeOrmModule.forRootAsync({
            useClass: Database,
            inject: [ConfigService],
        }),
    ],
    providers: [Database]
})
export class CustomConfigModule { }
