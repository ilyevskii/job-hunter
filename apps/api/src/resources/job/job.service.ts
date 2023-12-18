import { DATABASE_DOCUMENTS } from 'app-constants';
import { Job } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Job>(DATABASE_DOCUMENTS.JOBS);

export default service;
