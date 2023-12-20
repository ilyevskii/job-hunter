import { User, Employer } from 'database';

export type UserWithEmployer = User & {
  employer?: Employer;
  industries?: string[];
};
