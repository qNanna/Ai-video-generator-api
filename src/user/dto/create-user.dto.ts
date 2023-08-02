import { ApiProperty } from '@nestjs/swagger';

import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

export const emailRegExp: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class UserDto {
  @JoiSchema(Joi.string().required().regex(emailRegExp))
  @ApiProperty({ default: "Thomas@gmail.com", example: "Thomas@gmail.com" })
  userName: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "WhereIsMyCar?", example: "WhereIsMyCar?" })
  password: string;
}

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class CreateUserDto extends UserDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "https://google.com", example: "https://google.com", description: "Front-end side URL which should send additional request for activating user." })
  acceptCallbackURL: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ example: "Thomas", default: "Thomas" })
  name: string;
}