import { applicationService } from 'resources/application';

import { AppKoaContext, AppRouter, Next, Application } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

type Request = {
  params: {
    id: string;
  };
};
type ValidatedData = {
  application: Application,
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(!Number.isNaN(+id), 'Incorrect application id');

  const application = await applicationService.findOne({
    where: { id: +id },
    join: {
      table: DATABASE_DOCUMENTS.RESUMES,
      field: 'resumeId',
      resultField: 'resume',
    },
  });

  ctx.assertError(application, 'Application not found');

  ctx.validatedData = { application };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  ctx.body = ctx.validatedData.application;
}

export default (router: AppRouter) => {
  router.get(
    '/:id',
    validator,
    handler,
  );
};
