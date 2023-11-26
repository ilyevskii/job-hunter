import _ from 'lodash';

import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';
import { DatabaseService } from 'services';

import { User } from '@prisma/client';

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
