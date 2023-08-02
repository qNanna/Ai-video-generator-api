import { Module, forwardRef } from '@nestjs/common';

import { SocketsGateway } from './sockets.gateway';
import { JwtModuleAsync } from '../app.module';

@Module({
  imports: [
    forwardRef(() => JwtModuleAsync)
  ],
  providers: [SocketsGateway],
  exports: [SocketsGateway]
})
export class SocketsModule { }
