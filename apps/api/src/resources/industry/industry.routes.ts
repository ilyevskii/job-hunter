import { routeUtil } from 'utils';

import list from './actions/list';

const publicRoutes = routeUtil.getRoutes([
  list,
]);

export default {
  publicRoutes,
};
