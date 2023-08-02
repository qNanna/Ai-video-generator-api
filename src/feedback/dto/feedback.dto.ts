import { ApiProperty } from '@nestjs/swagger';

import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { emailRegExp } from '../../user/dto/create-user.dto';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class FeedbackDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "John Doe", example: "John Doe" })
  name: string;

  @JoiSchema(Joi.string().required().regex(emailRegExp))
  @ApiProperty({ default: "johnDoe@email.com", example: "johnDoe@email.com" })
  email: string;

  @JoiSchema(Joi.string().required().min(5).max(500))
  @ApiProperty({ default: "Please send me privacy&policy.", example: "Please send me privacy&policy.", description: 'Any message. Chars: min - 5, max - 500' })
  message: string;
}