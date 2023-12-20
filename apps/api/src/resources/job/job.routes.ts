import { routeUtil } from 'utils';

import remove from './actions/remove';
import create from './actions/create';
import update from './actions/update';
import list from './actions/list';
import get from './actions/get';

const privateRoutes = routeUtil.getRoutes([
  remove,
  create,
  update,
  list,
  get,
]);

export default {
  privateRoutes,
};
