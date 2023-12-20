import { employerIndustryService } from 'resources/employerIndustry';

import { AppKoaContext, AppRouter } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;
  let employerIndustries: any[] = [];

  if (user.employer) {
    employerIndustries = (await employerIndustryService.findAll({
      where: { employerId: user.employer.id },
      join: {
        table: DATABASE_DOCUMENTS.INDUSTRIES,
        field: 'industryId',
        resultField: 'industry',
      },
    })) ?? [];
  }

  ctx.body = {
    ...user,
    industries: employerIndustries.map(v => String(v.industry.id)),
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
