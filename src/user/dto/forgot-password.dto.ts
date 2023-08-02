import { ApiProperty } from "@nestjs/swagger";

import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class ForgotPasswordDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ example: "Thomas@gmail.com" })
  email: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ description: 'Link to front-end password reset page.' })
  callbackURL: string;
}