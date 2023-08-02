import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

@JoiSchemaOptions({ allowUnknown: false, abortEarly: true })
export class PageOptionsDto {
  @JoiSchema(Joi.string().optional().default(Order.ASC))
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  readonly order?: Order = Order.ASC;

  @JoiSchema(Joi.number().optional())
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  readonly page?: number = 1;

  @JoiSchema(Joi.number().optional())
  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  readonly take?: number = 10;

  // Only with class-transformer
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}