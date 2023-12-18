import { z } from 'zod';

import { userService } from 'resources/user';
import { jobService } from 'resources/job';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';
import { employerService } from '../../employer';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  searchValue: z.string().optional(),
  employerId: z.string().transform(Number).optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { employerId } = ctx.validatedData;

  const employer = await userService.count({ id: employerId });

  ctx.assertError(!employerId || employer, 'Employer not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { perPage, page, searchValue, employerId } = ctx.validatedData;

  const jobs = await jobService.findAll({
    where: (employerId ? {
      employerId,
    } : {}),
    ...(searchValue ? {
      search: {
        columns: ['title'],
        value: searchValue,
      },
    } : {}),
    perPage,
    page,
  });

  const totalCount = await jobService.count({ employerId });

  const modifiedJobs = await Promise.all((jobs ?? []).map(async (j) => ({
    ...j,
    employer: await employerService.findOne({ id: j.employerId }),
  })));

  ctx.body = {
    items: modifiedJobs,
    totalPages: Math.ceil(totalCount / perPage),
    count: totalCount,
    page,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
