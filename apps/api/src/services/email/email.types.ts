import { Template, TemplateProps } from 'mailer';

export interface EmailServiceConstructorProps {
  apiKey: string | undefined,
  from: string,
}

interface Attachment {
  content?: string | Buffer;
  filename?: string | false;
  path?: string;
}

export interface SendTemplateParams<T extends Template> {
  to: string,
  subject: string,
  template: T,
  params: TemplateProps[T],
  attachments?: Attachment[],
}