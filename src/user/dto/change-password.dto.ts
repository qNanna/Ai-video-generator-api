import { ApiProperty } from "@nestjs/swagger";

import * as Joi from "joi";
import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class ChangePasswordDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ example: "WhereIsMyCar?" })
  currentPassword: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ example: "WhereIsMyCar?" })
  password: string;
}