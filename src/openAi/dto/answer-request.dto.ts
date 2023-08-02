import { ApiProperty } from '@nestjs/swagger';

import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class AnswerRequestDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "Tell me about quantum mechanic" })
  text: string;
}