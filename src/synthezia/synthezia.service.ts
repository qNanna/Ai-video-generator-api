import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ReadStream } from 'fs';
import fetch from 'cross-fetch';

import { IBodyInput } from './interfaces/IRequestBody';
import { IResponseBody } from './interfaces/IResponseBody';

@Injectable()
export class SyntheziaService implements ISyntheziaService {
  private apiUrl: Record<string, string>;
  private apiKey: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('SYNTHEZIA_API_KEY');
    this.apiUrl = {
      api: 'https://api.synthesia.io/v2',
      videos: 'https://api.synthesia.io/v2/videos',
      uploadAsset: 'https://upload.api.synthesia.io/v2/assets',
      fromTemplate: 'https://api.synthesia.io/v2/videos/fromTemplate'
    }
  }

  async generateVideo(data: IBodyInput) {
    const { visibility, title, description } = data;
    const { scriptText, background, avatar, avatarSettings } = data;

    const bodyData = {
      visibility,
      title,
      description,
      input: [{ scriptText, avatar, background, avatarSettings }]
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    };

    const response = await fetch(`${this.apiUrl.videos}`, options);

    return await response.json();
  }

  async checkVideoStatus(id: string) {
    const config = { headers: { Authorization: this.apiKey } };
    const response = await fetch(`${this.apiUrl.videos}/${id}`, config);

    return await response.json();
  }

  async setAsset(video: ReadStream) {
    const options = {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'video/mp4',
      },
      redirect: 'follow',
      body: video
    };

    const response = await fetch(this.apiUrl.uploadAsset, options);

    return response.json();
  }

  async downloadVideo(url: string) {
    const response = await fetch(url)

    return Buffer.from(await response.arrayBuffer());
  }
}

export interface ISyntheziaService {
  generateVideo(data: IBodyInput): Promise<IResponseBody>;
  checkVideoStatus(id: string): Promise<Record<string, unknown>>;
  downloadVideo(url: string): Promise<Buffer>;
  setAsset(video: ReadStream): Promise<{ id: string }>;
}