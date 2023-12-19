import _ from 'lodash';
import { z } from 'zod';

import { applicationService } from 'resources/application';
import { resumeService } from 'resources/resume';
import { jobService } from 'resources/job';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';

const schema = z.object({
  jobId: z.number().min(1, 'Please provide job id'),
  resumeId: z.string().min(1, 'Please resume job id').transform(Number),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { jobId, resumeId } = ctx.validatedData;

  const job = await jobService.count({ id: jobId });
  const resume = await resumeService.count({ id: resumeId });
  const isApplicationExists = await applicationService.count({
    userId: ctx.state.user.id,
    jobId,
  });

  ctx.assertError(job, 'Job not found');
  ctx.assertError(resume, 'Resume not found');
  ctx.assertError(!isApplicationExists, 'You already applied for this job');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  ctx.body = await applicationService.insertOne({
    userId: ctx.state.user.id,
    status: 'PENDING',
    ..._.pickBy(ctx.validatedData),
  });
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
