import _ from 'lodash';

import { employerService } from 'resources/employer';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { User, UserWithEmployer } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<User>(DATABASE_DOCUMENTS.USERS);

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

const getWithEmployer = async ({ where }: { where: Partial<User> }): Promise<UserWithEmployer | null> => {
  const user = await service.findOne({ where });

  if (user) {

    const employerData = await employerService.findOne({
      where: { userId: user.id },
    });

    return {
      ...user,
      ...(employerData ? {
        employer: employerData,
      } : {}),
    };
  }

  return null;
};

export default Object.assign(service, {
  getPublic,
  getWithEmployer,
});
