import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/user.entity';

@Injectable()
export class Database implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('PG_HOST'),
            port: parseInt(this.configService.get<string>('PG_PORT'), 10),
            username: this.configService.get<string>('PG_USER'),
            password: this.configService.get<string>('PG_PASSWORD'),
            database: this.configService.get<string>('PG_DB'),
            entities: [User],
            synchronize: true,
        };
    }
}
