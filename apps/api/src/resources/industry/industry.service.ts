import { DATABASE_DOCUMENTS } from 'app-constants';
import { Industry } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Industry>(DATABASE_DOCUMENTS.INDUSTRIES);

export default service;
