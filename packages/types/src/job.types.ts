import { Job, Employer, Industry } from 'database';

export type JobWithEmployer = Job & {
  employer: Employer;
  industries: Industry[];
};
