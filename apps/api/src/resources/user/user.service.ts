import _ from 'lodash';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { User } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<User>(DATABASE_DOCUMENTS.USERS);

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  getPublic,
});
