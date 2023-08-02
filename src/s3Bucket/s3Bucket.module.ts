import { Module } from '@nestjs/common';
import { S3BucketService } from './s3Bucket.service';

@Module({
  providers: [{
    provide: 'IS3BucketService',
    useClass: S3BucketService,
  }],
  exports: [{
    provide: 'IS3BucketService',
    useClass: S3BucketService,
  }],
})
export class S3BucketModule { }
