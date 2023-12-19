import { resumeService } from 'resources/resume';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const resumes = await resumeService.findAll({
    where: {
      userId: ctx.state.user.id,
    },
  });

  ctx.body = {
    items: resumes,
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
