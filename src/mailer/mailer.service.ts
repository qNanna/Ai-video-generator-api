import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { MailEntity } from './entities/mail.entity';

// ?: maybe change to aws mailer for prod, and charging only aws
@Injectable()
export class MailerService implements IMailerService, OnModuleInit {
  private transporter: any;

  constructor(private readonly configServise: ConfigService) { }

  async onModuleInit() {
    const email = this.configServise.get<string>('SMTP_EMAIL');
    const password = this.configServise.get<string>('SMTP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: "mail.gmx.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  async sendMail(mailData: MailEntity) {
    const { response, messageId } = await this.transporter.sendMail(mailData);

    return { response, messageId };
  }
}

export interface IMailerService {
  sendMail(mailData: MailEntity): Promise<Record<string, unknown>>;
}
