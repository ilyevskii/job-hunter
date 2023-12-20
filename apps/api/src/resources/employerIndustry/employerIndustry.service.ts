import { DATABASE_DOCUMENTS } from 'app-constants';
import { Employer_Industry } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Employer_Industry>(DATABASE_DOCUMENTS.EMPLOYER_INDUSTRIES);

export default service;
