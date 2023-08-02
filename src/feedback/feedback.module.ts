import { Module } from '@nestjs/common';

import { MailerModule } from '../mailer/mailer.module';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [MailerModule],
  controllers: [FeedbackController]
})
export class FeedbackModule { }
