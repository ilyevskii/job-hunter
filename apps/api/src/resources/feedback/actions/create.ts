import _ from 'lodash';
import { z } from 'zod';

import { applicationService } from 'resources/application';
import { feedbackService } from 'resources/feedback';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

const schema = z.object({
  applicationId: z.number().min(1, 'Please provide application id'),
  status: z.enum(['DECLINED', 'ACCEPTED']),
  content: z.string().min(1, 'Please feedback content').max(10_000),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { applicationId } = ctx.validatedData;

  const application: any = await applicationService.findOne({
    where: { id: applicationId },
    join: {
      table: DATABASE_DOCUMENTS.JOBS,
      field: 'jobId',
      resultField: 'job',
    },
  });

  const feedback = await feedbackService.count({ applicationId });

  ctx.assertError(application, 'Application not found');
  ctx.assertError(!feedback, 'Feedback already exists');
  ctx.assertError(application.job.employerId === ctx.state.user.id, 'You can add feedback only to your jobs!');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { status, applicationId } = ctx.validatedData;

  await applicationService.updateOne({
    id: applicationId,
  }, {
    status,
  });

  ctx.body = await feedbackService.insertOne({
    employerId: ctx.state.user.id,
    ..._.omit(ctx.validatedData, 'status'),
  });
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
