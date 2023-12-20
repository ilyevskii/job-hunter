import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';

import { applicationRoutes } from 'resources/application';
import { feedbackRoutes } from 'resources/feedback';
import { accountRoutes } from 'resources/account';
import { resumeRoutes } from 'resources/resume';
import { jobRoutes } from 'resources/job';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/jobs', compose([auth, jobRoutes.privateRoutes])));
  app.use(mount('/applications', compose([auth, applicationRoutes.privateRoutes])));
  app.use(mount('/resumes', compose([auth, resumeRoutes.privateRoutes])));
  app.use(mount('/feedbacks', compose([auth, feedbackRoutes.privateRoutes])));
};
