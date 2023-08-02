import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';
import { PageOptionsDto, VideosPageOptionsDto } from './dto/video-data.dto';
import { PageMetaDto } from './entities/page-meta.entity';

@Injectable()
export class VideoRepository {
  constructor(
    @InjectRepository(VideoEntity) private readonly videoRepo: Repository<VideoEntity>
  ) { }

  async create(data: Partial<VideoEntity>): Promise<VideoEntity> {
    return await this.videoRepo.save(data);
  }

  async delete(data: Partial<VideoEntity>): Promise<DeleteResult> {
    return await this.videoRepo.delete(data);
  }

  async findOneBy(data: Partial<VideoEntity>) {
    return await this.videoRepo.findOneBy(data);
  }

  async findBy(data: Partial<VideoEntity>) {
    return await this.videoRepo.findBy(data);
  }

  async update(filter: Partial<VideoEntity>, data: Partial<VideoEntity>) {
    return await this.videoRepo.update(filter, data)
  }

  // TODO: Pagination by coursour
  async getAndPaginate(pageOptionsDto: VideosPageOptionsDto, userId: string) {
    const { page, take, order, completed, deleted } = pageOptionsDto;
    const skip = (page - 1) * take;

    const queryBuilder = this.videoRepo.createQueryBuilder("video")
      .where("video.userId = :userId", { userId })
      .andWhere("video.deleted = :deleted", { deleted })
      .orderBy("video.id", order)
      .skip(skip)
      .take(take);

    if ("completed" in pageOptionsDto) {
      queryBuilder
        .andWhere("completed = :completed", { completed })
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return { data: entities, meta: pageMetaDto };
  }
}