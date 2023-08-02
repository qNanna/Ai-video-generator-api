import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { join } from 'path';
import { ReadStream, createReadStream, statSync } from 'fs';

import { ISyntheziaService } from '../synthezia/synthezia.service';
import { IResponseBody } from '../synthezia/interfaces/IResponseBody';
import { IS3BucketService } from '../s3Bucket/s3Bucket.service';
import { VideosPageOptionsDto, VideoDataDto } from './dto/video-data.dto';
import { IVideoEntity, VideoEntity } from './entities/video.entity';
import { VideoRepository } from './video.repository';

@Injectable()
export class VideosService implements IVideosService {
  constructor(
    @Inject('ISyntheziaService') private readonly syntheziaService: ISyntheziaService,
    @Inject('IS3BucketService') private readonly s3BucketService: IS3BucketService,
    private readonly videoRepository: VideoRepository,
  ) { }

  async generateVideo(data: VideoDataDto) {
    return await this.syntheziaService.generateVideo(data);
  }

  async checkVideoStatus(id: string) {
    return await this.syntheziaService.checkVideoStatus(id);
  }

  async setAsset(video: ReadStream) {
    return await this.syntheziaService.setAsset(video);
  }

  async downloadVideoFromLink(url: string) {
    return await this.syntheziaService.downloadVideo(url);
  }

  async uploadVideo(userId: string, videoId: string, buffer: any) {
    const params = this.s3BucketService.setParams(`videos/${userId}/${videoId}.mp4`, buffer);

    return await this.s3BucketService.upload(params);;
  }

  async downloadVideo(userId: string, videoId: string) {
    const params = this.s3BucketService.setParams(`videos/${userId}/${videoId}.mp4`);

    return await this.s3BucketService.download(params);
  }

  async saveVideoEntity(data: Partial<VideoEntity>) {
    return await this.videoRepository.create(data);
  }

  async deleteVideoEntity(data: Partial<IVideoEntity>) {
    return await this.videoRepository.delete(data);
  }

  async getUserVideoEntity(data: Partial<IVideoEntity>) {
    return await this.videoRepository.findOneBy(data);
  }

  async getUserVideosEntity(pageOptions: VideosPageOptionsDto, userId: string) {
    return await this.videoRepository.getAndPaginate(pageOptions, userId);
  }

  async deleteVideoFromBucket(key: string) {
    const params = this.s3BucketService.setParams(key);

    return await this.s3BucketService.delete(params);
  }

  async updateVideoEntity(filter: Partial<IVideoEntity>, data: Partial<IVideoEntity>) {
    return await this.videoRepository.update(filter, data);
  }

  async getSignedUrl(key: string) {
    return await this.s3BucketService.getSignedUrl(key, GetObjectCommand)
  }

  getLocalVideo(name: string, range?: string, readStream?: boolean) {
    const filePath = join(process.cwd(), `files/${name}.mp4`);
    if (!!readStream) {
      const size = statSync(filePath).size;
      const chunkSize = 10 ** 6;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + chunkSize, size - 1);

      const file = createReadStream(filePath, { start, end });

      return { file, start, end, size, chunkSize };
    }

    return createReadStream(filePath)
  }
}

export interface IVideosService {
  generateVideo(data: VideoDataDto): Promise<IResponseBody>;
  checkVideoStatus(id: string): Promise<Record<string, unknown>>;
  uploadVideo(userId: string, videoId: string, buffer: any): Promise<Record<string, unknown>>;
  downloadVideo(userId: string, videoId: string): Promise<any>;
  downloadVideoFromLink(url: string): Promise<Buffer>;
  setAsset(video: ReadStream): Promise<Record<string, unknown>>;
  saveVideoEntity(data: IVideoEntity): any;
  deleteVideoEntity(data: Partial<VideoEntity>): any;
  getUserVideoEntity(data: Partial<VideoEntity>): Promise<VideoEntity>;
  getUserVideosEntity(data: Partial<VideosPageOptionsDto>, userId: string): Promise<any>;
  deleteVideoFromBucket(key: string): Promise<any>;
  updateVideoEntity(filter: Partial<VideoEntity>, data: Partial<VideoEntity>): Promise<any>;
  getSignedUrl(key: string): Promise<string>;

  getLocalVideo(name: string, range?: string, origin?: boolean): any;
}
