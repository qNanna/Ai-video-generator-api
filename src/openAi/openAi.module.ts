import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { OpenAiService } from './openAi.service';
import { OpenAiController } from './openAI.controller';
import { UserModule } from '../user/user.module';
import { StripeModule } from '../stripe/stripe.module';
import { JwtModuleAsync } from '../app.module';

@Module({
  imports: [
    UserModule,
    StripeModule
  ],
  controllers: [OpenAiController],
  providers: [{
    provide: 'IOpenAiService',
    useClass: OpenAiService,
  }],
  exports: [{
    provide: 'IOpenAiService',
    useClass: OpenAiService,
  }],
})
export class OpenAiModule { }
