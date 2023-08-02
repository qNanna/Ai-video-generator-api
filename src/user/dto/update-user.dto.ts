import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class UpdateUserDto {
  @JoiSchema(Joi.string().optional().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
  @ApiProperty({ example: "Thomas" })
  userName: string;

  @JoiSchema(Joi.string().optional())
  @ApiProperty({ example: "WhereIsMyCar?" })
  password: string;

  @JoiSchema(Joi.string().optional())
  @ApiProperty({ example: "Thomas" })
  name: string;

  @JoiSchema(Joi.boolean().optional())
  @ApiProperty({ example: true })
  isActive: boolean;
}