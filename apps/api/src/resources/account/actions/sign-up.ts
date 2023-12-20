import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';
import config from 'config';

import { AppKoaContext, Next, AppRouter, Template, User } from 'types';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().regex(PASSWORD_REGEX, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.count({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    firstName,
    lastName,
    email,
    password,
  } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.insertOne({
    email,
    firstName,
    lastName,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
  });

  await emailService.sendTemplate<Template.VERIFY_EMAIL>({
    to: user.email,
    subject: 'Please Confirm Your Email Address',
    template: Template.VERIFY_EMAIL,
    params: {
      firstName: firstName,
      href: `${config.API_URL}/account/verify-email?token=${signupToken}`,
    },
  });

  ctx.body = config.IS_DEV ? { signupToken } : {};
}

export default (router: AppRouter) => {
  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
