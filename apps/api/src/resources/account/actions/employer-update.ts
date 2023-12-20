import _ from 'lodash';
import { z } from 'zod';

import { userService } from 'resources/user';
import { employerService } from 'resources/employer';
import { employerIndustryService } from 'resources/employerIndustry';

import { AppKoaContext, Next, AppRouter } from 'types';
import { PASSWORD_REGEX } from 'app-constants';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  location: z.string().min(1, 'Please enter location').max(100),
  numberOfWorkers: z.number().positive('Please enter number of workers').max(100_000),
  industries: z.array(z.string()).nonempty(),
  password: z.string().regex(
    PASSWORD_REGEX,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ).or(z.literal('')).optional().nullable(),
}).strict();

interface ValidatedData extends z.infer<typeof schema> {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  if (_.isEmpty(ctx.validatedData)) {
    ctx.body = userService.getPublic(user);

    return;
  }

  if ('password' in ctx.validatedData) {
    if (password) ctx.validatedData.passwordHash = await securityUtil.getHash(password);

    delete ctx.validatedData.password;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { industries } = ctx.validatedData;

  const updatedUser = await userService.updateOne(
    { id: user.id },
    _.pick(ctx.validatedData, 'passwordHash'),
  );

  const updatedEmployer = await employerService.updateOne(
    { userId: user.id },
    _.omit(ctx.validatedData, 'passwordHash', 'industries'),
  );

  if (ctx.validatedData.industries) {
    await employerIndustryService.deleteMany({ employerId: user.employer?.id });
    console.log('DELETED');
    console.log(industries);
    console.log(await employerIndustryService.insertMany(industries.map((i) => {
      if (i) return { industryId: +i, employerId: user.employer?.id };
      return {};
    })));
  }

  ctx.body = {
    ...userService.getPublic(updatedUser),
    employer: updatedEmployer,
  };
}

export default (router: AppRouter) => {
  router.put('/employer', validateMiddleware(schema), validator, handler);
};
