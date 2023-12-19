import { DATABASE_DOCUMENTS } from 'app-constants';
import { Application } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Application>(DATABASE_DOCUMENTS.APPLICATIONS);

export default service;
