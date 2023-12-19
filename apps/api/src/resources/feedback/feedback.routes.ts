import { routeUtil } from 'utils';

import create from './actions/create';
import get from './actions/get';

const publicRoutes = routeUtil.getRoutes([
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  get,
]);

const adminRoutes = routeUtil.getRoutes([
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
