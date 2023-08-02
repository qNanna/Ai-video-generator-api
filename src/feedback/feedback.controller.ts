import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { FeedbackDto } from './dto/feedback.dto';
import { IMailerService } from '../mailer/mailer.service';

@ApiTags('Feedback')
@Controller('v1/feedback')
export class FeedbackController {
  private readonly apiEmail: string

  constructor(
    private readonly configService: ConfigService,
    @Inject('IMailerService') private readonly mailerService: IMailerService
  ) {
    this.apiEmail = this.configService.get<string>('SMTP_EMAIL');
  }

  @Post()
  @ApiOperation({ description: 'Getting messages from landing page.', summary: 'For landing page only!' })
  async getFeedback(@Body() data: FeedbackDto) {
    const { name, email, message } = data;

    // await this.mailerService.sendMail({ })
  }

  // REMOVED
}
