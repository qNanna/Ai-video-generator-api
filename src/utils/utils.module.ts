import { Module } from '@nestjs/common';

import { Swagger } from './swagger';

@Module({
  providers: [Swagger]
})

export class UtilsModule { }