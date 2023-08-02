import { Module } from '@nestjs/common';

import { SyntheziaService } from './synthezia.service';

@Module({
  imports: [],
  providers: [{
    provide: 'ISyntheziaService',
    useClass: SyntheziaService,
  }],
  exports: [{
    provide: 'ISyntheziaService',
    useClass: SyntheziaService,
  }],
})
export class SyntheziaModule { }
