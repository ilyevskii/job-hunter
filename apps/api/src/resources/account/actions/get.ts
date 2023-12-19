import { AppKoaContext, AppRouter } from 'types';

import { userService } from 'resources/user';
import { employerService } from 'resources/employer';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const employer = await employerService.findOne({
    where: { userId: user.id },
  });

  ctx.body = {
    ...userService.getPublic(user),
    ...(employer ??  {}),
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
