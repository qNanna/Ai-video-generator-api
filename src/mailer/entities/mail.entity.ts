export class MailEntity {
  from: string;
  to: string;
  subject: string
  text?: string
  html?: string;
  amp?: string;
}