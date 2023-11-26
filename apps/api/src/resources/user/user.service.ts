import _ from 'lodash';

import db from 'db';
import { DatabaseService } from 'services';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { User } from 'types';

const service = new DatabaseService<User>(db, DATABASE_DOCUMENTS.USERS);

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  getPublic,
});
