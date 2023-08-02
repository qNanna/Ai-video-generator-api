import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards, Delete, Patch, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';
import { omit } from "lodash"

import { IVideosService } from './videos.service';
import { VideosPageOptionsDto, VideoDataDto } from './dto/video-data.dto';
import { IOpenAiService } from '../openAi/openAi.service';
import { AuthGuard } from '../enchancers/guards/auth.guard';
import { IVideoEntity } from './entities/video.entity';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { IUserService } from '../user/user.service';
import { UpdateVideoDataDto } from './dto/update-video-data.dto';

@ApiTags('Video')
@Controller('v1/video')
export class VideosController {
  constructor(
    private readonly socketsGateway: SocketsGateway,
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IVideosService') private readonly videosService: IVideosService,
    @Inject('IOpenAiService') private readonly openAiService: IOpenAiService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async generate(@Body() data: VideoDataDto, @Req() req: Request) {
      const { scriptText, duration } = data;
      const openAiText = await this.openAiService.createCompetition(scriptText, duration);

      return await this.videosService.generateVideo({ data, scriptText: openAiText });
  }

  @Get('entities')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async getUserVideos(@Req() req: Request, @Query() query: VideosPageOptionsDto) {
    const userId = req['user'].id;

    const videoEntity = await this.videosService.getUserVideosEntity(query, userId);
    if (!videoEntity) 
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);

    return videoEntity;
  }

  @Get('entities/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async getVideo(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].id;

    return await this.videosService.getUserVideoEntity({ userId, videoId: id });
  }

  @Get('stream/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async getVideoStreamById(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].id;

    const videoUrl = await this.videosService.getSignedUrl(`videos/${userId}/${id}.mp4`);
    if (!videoUrl) 
      throw new HttpException('Not Found at Bucket', HttpStatus.FORBIDDEN);

    return { streamUrl: videoUrl };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async updateVideoData(@Body() data: UpdateVideoDataDto, @Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].id;

    const visibility = data.visibility === 'private' ? false : true;
    const { affected } = await this.videosService.updateVideoEntity({ userId, videoId: id }, { ...data, visibility });

    return affected;
  }

  // * Synthezia video status webhook
  // * ---------------------------------------------------------------------------
  @Post('webhook/status')
  @ApiExcludeEndpoint()
  async webhookStatus(@Body() { data }: Record<string, any>, @Res() res: Response) {
    const { id, duration, visibility, status, download } = data;

    console.log('\x1b[32m%s\x1b[0m', `Video completed webhook: ${id}`);
    res.status(200).send(true); // Send for reject trigger endpoint again.

    const video = await this.videosService.getUserVideoEntity({ videoId: id });
    this.socketsGateway.emitVideoStatus(video.userId, id);

    return await this.videosService.downloadVideoFromLink(download);
  }
  // * ---------------------------------------------------------------------------

  // REMOVED
}
