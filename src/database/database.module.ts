import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { VideoEntity } from '../videos/entities/video.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        url: configService.get<string>('DATABASE_URL'),
        ssl: true,
        extra: {
          ssl: { rejectUnauthorized: false }
        },
        synchronize: true,
        entities: [UserEntity, VideoEntity],
      }),
      dataSourceFactory: async (options) => await new DataSource(options).initialize()
    }),
  ],
})
export class DatabasebModule { }
