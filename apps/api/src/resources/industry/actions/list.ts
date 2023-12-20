import { industryService } from 'resources/industry';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const industries = await industryService.findAll({});

  ctx.body = {
    items: industries,
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
