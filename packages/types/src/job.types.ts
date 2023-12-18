import { Job, Employer } from 'database';

export type JobWithEmployer = Job & {
  employer: Employer;
};
