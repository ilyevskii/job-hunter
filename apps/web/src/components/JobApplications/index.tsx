import { FC } from 'react';
import { Stack, Group, Text, Title } from '@mantine/core';

import { applicationApi } from 'resources/application';

import ViewResumeButton from '../ViewResumeButton';
import CreateFeedbackButton from '../CreateFeebackButton';

interface JobApplicationsProps {
  jobId: number;
  userId: number;
}

const JobApplications: FC<JobApplicationsProps> = ({ jobId, userId }) => {
  const { data: applications } = applicationApi.useList({
    jobId,
    userId,
  });

  if (!applications || !applications.items) return null;

  return (
    <Stack>
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
