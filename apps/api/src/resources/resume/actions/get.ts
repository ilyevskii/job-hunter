import { resumeService } from 'resources/resume';

import { AppKoaContext, AppRouter, Next, Resume } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

type Request = {
  params: {
    id: string;
  };
};
type ValidatedData = {
  resume: Resume,
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(!Number.isNaN(+id), 'Incorrect resume id');

  const resume = await resumeService.findOne({
    where: { id: +id },
    join: {
      table: DATABASE_DOCUMENTS.USERS,
      field: 'userId',
      resultField: 'user',
    },
  });

  ctx.assertError(resume, 'Resume not found');

  ctx.validatedData = { resume };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  ctx.body = ctx.validatedData.resume;
}

export default (router: AppRouter) => {
  router.get(
    '/:id',
    validator,
    handler,
  );
};
