import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JoiPipeModule } from 'nestjs-joi';

import { SyntheziaModule } from '../synthezia/synthezial.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { S3BucketModule } from '../s3Bucket/s3Bucket.module';
import { OpenAiModule } from '../openAi/openAi.module';
import { UserModule } from '../user/user.module';
import { VideoEntity } from './entities/video.entity';
import { VideoRepository } from './video.repository';
import { StripeModule } from '../stripe/stripe.module';
import { JwtModuleAsync } from '../app.module';
import { SocketsModule } from '../sockets/sockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity]),
    JwtModuleAsync,
    JoiPipeModule,
    SyntheziaModule,
    S3BucketModule,
    OpenAiModule,
    UserModule,
    StripeModule,
    SocketsModule
  ],
  controllers: [VideosController],
  providers: [
    VideoRepository,
    {
      provide: 'IVideosService',
      useClass: VideosService,
    }
  ]
})
export class VideosModule { }
