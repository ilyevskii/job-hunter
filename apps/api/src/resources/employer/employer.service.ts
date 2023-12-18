import { DATABASE_DOCUMENTS } from 'app-constants';
import { Employer } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Employer>(DATABASE_DOCUMENTS.EMPLOYERS);

export default service;
