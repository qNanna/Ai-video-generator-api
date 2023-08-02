// TODO: remove old v2 aws sdk and use new s3Client
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as signedUrl } from '@aws-sdk/s3-request-presigner';

import { IBucketParams } from './interfaces/IBucketParams';

// TODO ecnchance class. It is a simple class for test.
// Also pretty package for work with s3 https://www.npmjs.com/package/s3-node
@Injectable()
export class S3BucketService implements IS3BucketService {
  private s3: S3;
  private s3Client: S3Client;
  private bucketName: string;
  private expiresIn: number;

  constructor(private readonly configService: ConfigService) {
    const awsCredentials = {
      accessKeyId: this.configService.get<string>('S3_BUCKET_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('S3_BUCKET_SECRET_ACCESS_KEY'),
    }
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: awsCredentials
    });
    this.expiresIn = this.configService.get<number>('S3_URL_EXPIRE_TIME');
    this.s3 = new S3(awsCredentials);
  }

  setParams(Key: string, Body?: Buffer): IBucketParams {
    const params = { Bucket: this.bucketName, Key } as Params
    if (Body) params.Body = Body;

    return params as IBucketParams;
  }

  createCommand(key: string, Command: typeof GetObjectCommand) {
    const bucketParams = this.setParams(key);
    
    return new Command(bucketParams);
  }

  async getSignedUrl(key: string, Command: typeof GetObjectCommand): Promise<string> {
    const command = this.createCommand(key, Command);

    return signedUrl(this.s3Client, command, {
      expiresIn: this.expiresIn,
    });
  }

  async upload(params: IBucketParams) {
    return await this.s3.upload(params).promise();
  }

  async download(params: IBucketParams) {
    return await this.s3.getObject(params).promise();
  }

  async delete(params: IBucketParams) {
    return await this.s3.deleteObject(params).promise();
  }
}

export interface IS3BucketService {
  setParams(Key: string, Body?: Buffer): IBucketParams;
  upload(params: IBucketParams): Promise<any>;
  download(params: IBucketParams): Promise<any>;
  delete(params: IBucketParams): Promise<any>;
  getSignedUrl(key: string, Command: typeof GetObjectCommand): Promise<string>;
}
