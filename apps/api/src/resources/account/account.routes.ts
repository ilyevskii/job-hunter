import { routeUtil } from 'utils';

import get from './actions/get';
import update from './actions/update';
import uploadAvatar from './actions/upload-avatar';
import signUp from './actions/sign-up';
import employerSignUp from './actions/employer-sign-up';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';
import verifyEmail from './actions/verify-email';
import forgotPassword from './actions/forgot-password';
import resetPassword from './actions/reset-password';
import verifyResetToken from './actions/verify-reset-token';
import google from './actions/google';

const publicRoutes = routeUtil.getRoutes([
  signUp,
  employerSignUp,
  signIn,
  signOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  google,
]);

const privateRoutes = routeUtil.getRoutes([
  get,
  update,
  uploadAvatar,
]);

export default {
  publicRoutes,
  privateRoutes,
};
