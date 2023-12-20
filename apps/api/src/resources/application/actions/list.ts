import { z } from 'zod';

import { jobService } from 'resources/job';
import { userService } from 'resources/user';
import { applicationService } from 'resources/application';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

const schema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']).optional(),
  jobId: z.string().transform(Number),
  userId: z.string().transform(Number),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { jobId, userId } = ctx.validatedData;

  const job = await jobService.findOne({ where: { id: jobId } });
  const user = await userService.count({ id: userId });

  ctx.assertError(job, 'Job not found');
  ctx.assertError(user, 'User not found');
  ctx.assertError(job.employerId === ctx.state.user.employer?.id, 'You can see only your job applications');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { status, jobId } = ctx.validatedData;

  const jobs = await applicationService.findAll({
    where: (jobId ? {
      jobId,
    } : {}),
    ...(status ? {
      search: {
        columns: ['status'],
        value: status,
      },
    } : {}),
    join: {
      table: DATABASE_DOCUMENTS.USERS,
      field: 'userId',
      resultField: 'user',
    },
  });

  ctx.body = {
    items: jobs,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
