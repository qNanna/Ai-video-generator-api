import { ApiProperty } from "@nestjs/swagger";

import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class ResetPasswordDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ example: "WhereIsMyCar?" })
  password: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ description: 'generated field to ' })
  secret: string;
}