import { PickType } from "@nestjs/swagger";
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

import { VideoDataDto } from "./video-data.dto";

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class UpdateVideoDataDto extends PickType(VideoDataDto, ['title', 'description', 'visibility'] as const) {
  @JoiSchema(Joi.string().required())
  title: string;

  @JoiSchema(Joi.string().optional())
  description?: string | null;

  @JoiSchema(Joi.string().optional().default('private').valid('private', 'public'))
  visibility?: string;
}