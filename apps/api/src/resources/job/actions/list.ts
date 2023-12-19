import { z } from 'zod';

import { userService } from 'resources/user';
import { jobService } from 'resources/job';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';
import { employerService } from '../../employer';
import { DATABASE_DOCUMENTS } from 'app-constants';

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
    join: {
      table: DATABASE_DOCUMENTS.EMPLOYERS,
      field: 'employerId',
      resultField: 'employer',
    },
    perPage,
    page,
  });

  const totalCount = await jobService.count({ employerId });

  ctx.body = {
    items: jobs,
    totalPages: Math.ceil(totalCount / perPage),
    count: totalCount,
    page,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
