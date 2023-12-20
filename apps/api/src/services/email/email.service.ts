import { Resend } from 'resend';

import config from 'config';
import logger from 'logger';

import { renderEmailHtml, Template } from 'mailer';

import { EmailServiceConstructorProps, SendTemplateParams } from './email.types';

class EmailService {
  resend?: Resend;

  apiKey: string | undefined;

  from: string;

  constructor({ apiKey, from }: EmailServiceConstructorProps) {
    this.apiKey = apiKey;
    this.from = from;

    if (apiKey) this.resend = new Resend(apiKey);
  }

  async sendTemplate<T extends Template>({ to, subject, template, params, attachments }: SendTemplateParams<T>) {
    try {
      if (!this.resend) return null;

      const html = await renderEmailHtml({ template, params });

      return await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
        attachments,
      });
    } catch (err) {
      logger.error('Failed to send email', err);
    }
  }
}

export default new EmailService({
  apiKey: config.RESEND_API_KEY,
  from: 'DB Lab <no-reply@havensense.com>',
});
