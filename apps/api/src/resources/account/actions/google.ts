import { AppRouter, AppKoaContext } from 'types';

import { userService } from 'resources/user';

import { googleService, authService } from 'services';

import config from 'config';

type ValidatedData = {
  given_name: string;
  family_name: string;
  email: string;
  picture: string
};

const getOAuthUrl = async (ctx: AppKoaContext) => {
  const isValidCredentials = config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET;

  ctx.assertClientError(isValidCredentials, {
    global: 'Setup Google Oauth credentials on API',
  });

  ctx.redirect(googleService.oAuthURL);
};

const signInGoogleWithCode = async (ctx: AppKoaContext) => {
  const { code } = ctx.request.query;

  const { isValid, payload } = await googleService.
    exchangeCodeForToken(code as string) as { isValid: boolean, payload: ValidatedData };

  ctx.assertError(isValid, `Exchange code for token error: ${payload}`);

  const user = await userService.findOne({
    where: { email: payload.email },
  });
  let userChanged;

  if (user) {
    if (!user.oauthGoogle) {
      userChanged = await userService.updateOne(
        { id: user.id },
        { oauthGoogle: true },
      );
    }
    const userUpdated = userChanged || user;
    await authService.setTokens(ctx, userUpdated.id);

  } else {
    const lastName = payload.family_name || '';

    const newUser = await userService.insertOne({
      firstName: payload.given_name,
      lastName,
      email: payload.email,
      isEmailVerified: true,
      avatarUrl: payload.picture,
      oauthGoogle: true,
    });

    if (newUser) {
      await authService.setTokens(ctx, newUser.id);
    }
  }

  ctx.redirect(config.WEB_URL);
};



export default (router: AppRouter) => {
  router.get('/sign-in/google/auth', getOAuthUrl);
  router.get('/sign-in/google', signInGoogleWithCode);
};
