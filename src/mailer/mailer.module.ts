import { Module } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Module({
  providers: [{
    provide: 'IMailerService',
    useClass: MailerService,
  }],
  exports: [{
    provide: 'IMailerService',
    useClass: MailerService,
  }],
})

export class MailerModule { }
