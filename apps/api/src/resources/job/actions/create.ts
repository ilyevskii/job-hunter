import _ from 'lodash';
import { z } from 'zod';

import { jobService } from 'resources/job';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter } from 'types';

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

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  ctx.body = await jobService.insertOne({
    employerId: ctx.state.user.id,
    ..._.pickBy(ctx.validatedData),
  });
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
