import { applicationService } from 'resources/application';
import { feedbackService } from 'resources/feedback';
import { jobService } from 'resources/job';

import { AppKoaContext, AppRouter, Next, Application } from 'types';

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

  ctx.assertError(!Number.isNaN(+id), 'Incorrect job id');

  const job = await jobService.findOne({
    where: { id: +id },
  });

  ctx.assertError(job, 'Job not found');

  const application = await applicationService.findOne({
    where: {
      jobId: +id,
      userId: ctx.state.user.id,
    },
  });

  ctx.assertError(application, 'Application not found');

  ctx.validatedData = { application };

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.validatedData;

  console.log({
    status: application.status,
    feedback: await feedbackService.findOne({
      where: { applicationId: application.id },
    }),
  });

  ctx.body = {
    status: application.status,
    feedback: await feedbackService.findOne({
      where: { applicationId: application.id },
    }),
  };
}

export default (router: AppRouter) => {
  router.get('/:id', validator, handler);
};
