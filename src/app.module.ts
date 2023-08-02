import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { join } from 'path';

import { DatabasebModule } from './database/database.module';
import { VideosModule } from './videos/videos.module';
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';
import { StripeModule } from './stripe/stripe.module';
import { OpenAiModule } from './openAi/openAi.module';
import { FeedbackModule } from './feedback/feedback.module';

const kConfigModule = ConfigModule.forRoot({
  ignoreEnvFile: false,
  envFilePath: join(process.cwd(), '.env'),
  isGlobal: true,
  cache: true,
});

export const JwtModuleAsync = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN')
    }
  })
});

@Module({
  imports: [
    kConfigModule,
    JwtModuleAsync,
    DatabasebModule,
    VideosModule,
    UtilsModule,
    UserModule,
    OpenAiModule,
    StripeModule,
    FeedbackModule
  ],
})
export class AppModule { }
