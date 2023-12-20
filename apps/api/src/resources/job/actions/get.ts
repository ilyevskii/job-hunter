import { jobService } from 'resources/job';
import { employerIndustryService } from 'resources/employerIndustry';

import { AppKoaContext, AppRouter, Next } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

type Request = {
  params: {
    id: string;
  };
};
type ValidatedData = {
  job: any,
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
  const { job } = ctx.validatedData;

  let employerIndustries: any[] = [];

  if (job.employer) {
    employerIndustries = (await employerIndustryService.findAll({
      where: { employerId: job.employer.id },
      join: {
        table: DATABASE_DOCUMENTS.INDUSTRIES,
        field: 'industryId',
        resultField: 'industry',
      },
    })) ?? [];

    ctx.body = {
      ...job,
      industries: employerIndustries.map(v => v.industry),
    };
  }
}

export default (router: AppRouter) => {
  router.get(
    '/:id',
    validator,
    handler,
  );
};
