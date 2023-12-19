import { User, Application, Resume } from 'database';

export type ApplicationWithUser = Application & {
  user: User;
};

export type ResumeWithUser = Resume & {
  user: User;
};
