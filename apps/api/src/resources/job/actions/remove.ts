import { jobService } from 'resources/job';

import { AppKoaContext, AppRouter, Next } from 'types';

type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<never, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(!Number.isNaN(+id), 'Incorrect job id');

  const isJobExists = await jobService.count({ id: +id });

  ctx.assertError(isJobExists, 'Job not found');

  await next();
}

async function handler(ctx: AppKoaContext<never, Request>) {
  ctx.body = await jobService.deleteMany({ id: +ctx.request.params.id });
}

export default (router: AppRouter) => {
  router.delete(
    '/:id',
    validator,
    handler,
  );
};
