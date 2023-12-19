import { userService } from 'resources/user';
import { tokenService } from 'resources/token';

import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  const accessToken = ctx.state.accessToken;
  let userData;

  if (accessToken) {
    userData = await tokenService.findTokenByValue(accessToken);
  }

  if (userData && userData.userId) {
    const user = await userService.getWithEmployer({
      where: { id: userData.userId },
    });

    if (user) {
      ctx.state.user = user;
    }
  }

  return next();
};

export default tryToAttachUser;
