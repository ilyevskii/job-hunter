import { FC } from 'react';
import { Stack, Group, Text, Title, Divider } from '@mantine/core';

import { applicationApi } from 'resources/application';

import { JobWithEmployer } from 'types';

import ViewResumeButton from '../ViewResumeButton';
import CreateFeedbackButton from '../CreateFeebackButton';
import UpdateJobButton from '../UpdateJobButton';
import DeleteJobButton from '../DeleteJobButton';

interface JobApplicationsProps {
  job: JobWithEmployer;
  userId: number;
}

const JobApplications: FC<JobApplicationsProps> = ({ job, userId }) => {
  const { data: applications } = applicationApi.useList({
    jobId: job.id,
    userId,
  });

  if (!applications || !applications.items) return null;

  return (
    <Stack>
      <Divider />

      <Stack ml="auto">
        Options:
        <Group mr={30}>
          <UpdateJobButton job={job} />
          <DeleteJobButton job={job} />
        </Group>
      </Stack>

      <Title order={2}>Applications</Title>

      <Group>
        {applications.items.map((application) => (
          <Stack p={16} key={application.id} w="fit-content" style={{ border: '1px solid gray', borderRadius: 12 }}>
            <Text>
              {application.user.firstName}
              {' '}
              {application.user.lastName}
            </Text>

            <Group>
              <ViewResumeButton resumeId={application.resumeId ?? 1} />

              <CreateFeedbackButton applicationId={application.id} />
            </Group>
          </Stack>
        ))}
      </Group>
    </Stack>
  );
};

export default JobApplications;
