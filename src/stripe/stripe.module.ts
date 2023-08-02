import { Module, forwardRef } from '@nestjs/common';

import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { UserModule } from '../user/user.module';
import { JwtModuleAsync } from '../app.module';
import { SocketsModule } from '../sockets/sockets.module';

@Module({
  imports: [
    JwtModuleAsync,
    UserModule,
    SocketsModule
  ],
  controllers: [StripeController],
  providers: [
    { provide: 'IStripeService', useClass: StripeService }
  ],
  exports: [
    { provide: 'IStripeService', useClass: StripeService }
  ]
})
export class StripeModule { }
