import { jobService } from 'resources/job';

import { AppKoaContext, AppRouter, Next, Job } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

type Request = {
  params: {
    id: string;
  };
};
type ValidatedData = {
  job: Job,
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(!Number.isNaN(+id), 'Incorrect job id');

  const job = await jobService.findOne({
    where: { id: +id },
    join: {
      table: DATABASE_DOCUMENTS.EMPLOYERS,
      field: 'employerId',
      resultField: 'employer',
    },
  });

  ctx.assertError(job, 'Job not found');

  ctx.validatedData = { job };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  ctx.body = ctx.validatedData.job;
}

export default (router: AppRouter) => {
  router.get(
    '/:id',
    validator,
    handler,
  );
};
