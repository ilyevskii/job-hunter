import { DATABASE_DOCUMENTS } from 'app-constants';
import { Resume } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Resume>(DATABASE_DOCUMENTS.RESUMES);

export default service;
