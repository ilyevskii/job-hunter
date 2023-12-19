import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  ctx.body = ctx.state.user;
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
