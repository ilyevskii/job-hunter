import _ from 'lodash';
import { z } from 'zod';

import { jobService } from 'resources/job';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, Next, AppRouter } from 'types';

type Request = {
  params: {
    id: string;
  };
};

const schema = z.object({
  title: z.string().min(1, 'Please enter job title').max(255),
  description: z.string().min(1, 'Please job description').max(1_000),
  location: z.string().min(1, 'Please job description').max(255),
  salaryFrom: z.number().nonnegative().min(0, 'Please enter salary from'),
  salaryTo: z.number().nonnegative().min(0, 'Please enter salary to').max(1_000_000),
})
  .refine((data) => data.salaryFrom < data.salaryTo, {
    message: 'Salary To should be greater than Salary From',
    path: ['salaryTo'],
  })
  .refine((data) => data.salaryFrom < data.salaryTo, {
    message: 'Salary From should be less than Salary To',
    path: ['salaryFrom'],
  });

interface ValidatedData extends z.infer<typeof schema> {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(!Number.isNaN(+id), 'Incorrect job id');

  const isJobExists = await jobService.count({ id: +id });

  console.log('isJobExists ', isJobExists);

  ctx.assertError(isJobExists, 'Job not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  ctx.body = await jobService.updateOne(
    { id: +ctx.request.params.id },
    _.pickBy(ctx.validatedData),
  );
}

export default (router: AppRouter) => {
  router.put('/:id', validateMiddleware(schema), validator, handler);
};
