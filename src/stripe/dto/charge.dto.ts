import { ApiProperty } from '@nestjs/swagger';

import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class ChargeDto {
  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "price_1MsQkfATrFOZxUGeHvrnDNzq", example: "price_1MsQkfATrFOZxUGeHvrnDNzq" })
  priceId: string;

  @JoiSchema(Joi.number().optional().default(1))
  @ApiProperty({ default: 1, example: 1 })
  quantity: number;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "https://google.com", example: "https://google.com", description: 'Redirect on success' })
  success: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty({ default: "https://google.com", example: "https://google.com", description: 'Redirect on cancel' })
  cancel: string;
}