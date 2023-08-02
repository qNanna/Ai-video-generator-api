import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../dto/page-options.dto';

enum VideoBackgroundAvatar {
  Anna = 'anna_costume1_cameraA',
  Jack = 'jack_costume2_cameraA',
}

enum VideoVoice {
  // NATURAL
  Anna_ENG_GB = '20c248b7-aae7-45ed-88c5-9acc0be07aa4',
  Anna_ENG_US = '5fa3e6df-3674-4f58-96e8-c20036085445',
  Jack_ENG_GB = '7fe7a3e3-0116-4002-b7d0-773a9cedf289',
  Jack_ENG_US = '05be6cf8-a723-47ed-b001-4f97ee0b8b57',
}

enum VideoBackground {
  offWhite = 'off_white',
  warmWhite = 'warm_white',
  lightBlue = 'light_blue',
  softCyan = 'soft_cyan',
  whiteStudio = 'white_studio',
  whiteCafe = 'white_cafe',
  openOffice = 'open_office'
}

export class VideosPageOptionsDto extends PageOptionsDto {
  @JoiSchema(Joi.boolean().optional())
  @ApiPropertyOptional({ description: 'null: all records | true: only completed | false: not completed' })
  completed?: boolean;

  @JoiSchema(Joi.boolean().optional().default(false))
  @ApiPropertyOptional({ default: false })
  deleted?: boolean;
}

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
class AvatarSettingsDto {
  @JoiSchema(Joi.string().optional().valid(...Object.values(VideoVoice)))
  @ApiPropertyOptional({ enum: VideoVoice, examples: VideoVoice })
  voice?: string;

  @JoiSchema(Joi.string().optional().default('rectangular'))
  @ApiHideProperty()
  style: string = 'rectangular';
}

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class VideoDataDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "Tell me about quantum mechanic." })
  scriptText: string;

  @JoiSchema(Joi.string().required().valid(...Object.values(VideoBackgroundAvatar)))
  @ApiProperty({ enum: VideoBackgroundAvatar, default: VideoBackgroundAvatar.Anna, examples: VideoBackgroundAvatar })
  avatar: string;

  @JoiSchema(Joi.string().optional().default('off_white').valid(...Object.values(VideoBackground)))
  @ApiPropertyOptional({ default: VideoBackground.offWhite, enum: VideoBackground, examples: VideoBackground })
  background: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: `Some name ${Math.random()}, ${Date.now()}` })
  title: string;

  @JoiSchema(Joi.string().optional())
  @ApiPropertyOptional({ default: 'one-' + String(Date.now()) })
  description?: string | null;

  @JoiSchema(Joi.string().optional().default('private').valid('private', 'public'))
  @ApiPropertyOptional({ enum: ['private', 'public'] })
  visibility?: string;

  @JoiSchema(Joi.number().integer().required().default(1).min(1).max(16))
  @ApiProperty({ example: 1 })
  duration?: number;

  @JoiSchema(Joi.object({
    style: Joi.string().optional().default('rectangular'),
    voice: Joi.alternatives().conditional(Joi.ref('...avatar'), {
      is: VideoBackgroundAvatar.Anna,
      then: Joi.string().valid(VideoVoice.Anna_ENG_GB, VideoVoice.Anna_ENG_US).required(),
      otherwise: Joi.string().valid(VideoVoice.Jack_ENG_GB, VideoVoice.Jack_ENG_US).required()
    })
  }).optional())
  @ApiPropertyOptional({ type: AvatarSettingsDto })
  avatarSettings?: AvatarSettingsDto;
}

export { PageOptionsDto };

