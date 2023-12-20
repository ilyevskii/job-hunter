import { z } from 'zod';

import { userService } from 'resources/user';
import { employerService } from 'resources/employer';
import { employerIndustryService } from 'resources/employerIndustry';

import { validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';
import config from 'config';

import { AppKoaContext, Next, AppRouter, Template, User } from 'types';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  location: z.string().min(1, 'Please enter location').max(100),
  numberOfWorkers: z.number().positive('Please enter number of workers').max(100_000),
  industries: z.array(z.string()).nonempty(),
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().regex(
    PASSWORD_REGEX,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
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
    name,
    location,
    numberOfWorkers,
    email,
    password,
    industries,
  } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.insertOne({
    email,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
  });

  const [_, employer] = await Promise.all([
    emailService.sendTemplate<Template.VERIFY_EMAIL>({
      to: user.email,
      subject: 'Please Confirm Your Email Address',
      template: Template.VERIFY_EMAIL,
      params: {
        firstName: name,
        href: `${config.API_URL}/account/verify-email?token=${signupToken}`,
      },
    }),
    employerService.insertOne({
      userId: user.id,
      location,
      numberOfWorkers,
      name,
    }),
  ]);

  await employerIndustryService.insertMany(industries.map((i) => {
    if (i) return { industryId: +i, employerId: employer.id };
    return {};
  }));

  ctx.body = config.IS_DEV ? { signupToken } : {};
}

export default (router: AppRouter) => {
  router.post('/employer-sign-up', validateMiddleware(schema), validator, handler);
};
