import { DATABASE_DOCUMENTS } from 'app-constants';
import { Feedback } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Feedback>(DATABASE_DOCUMENTS.FEEDBACKS);

export default service;
