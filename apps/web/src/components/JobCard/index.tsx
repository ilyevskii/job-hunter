import { FC } from 'react';
import { Loader, Stack, Title, Text, Group } from '@mantine/core';

import { jobApi } from 'resources/job';
import { accountApi } from 'resources/account';

import JobApplications from '../JobApplications';

interface JobCardProps {
  id: number;
}

const JobCard: FC<JobCardProps> = ({ id }) => {
  const { data: job, isLoading: isJobLoading } = jobApi.useGet(id);
  const { data: account } = accountApi.useGet();

  if (isJobLoading) return <Loader size={40} />;

  if (!account) return null;

  return (
    job ? (
      <Stack gap={48}>
        <Title order={1}>
          {job.title}
        </Title>

        <Group justify="space-between" align="flex-start">
          <Stack gap={16} w="40%">
            <Text fw={900} fz={16}>
              Description
            </Text>

            <Text c="gray.8">
              {job.description}
            </Text>
          </Stack>

          <Stack gap={16} w="20%">
            <Text fw={900} fz={16}>
              Salary
            </Text>

            <Text c="gray.8">
              {job.salaryFrom}
              {' '}
              -
              {' '}
              {job.salaryTo}
              {' '}
              $
            </Text>
          </Stack>

          <Stack gap={16} w="20%">
            <Text fw={900} fz={16}>
              Location
            </Text>

            <Text c="gray.8">
              {job.location}
            </Text>
          </Stack>
        </Group>

        <Stack>
          <Title order={2}>
            Company info
          </Title>

          <Stack gap={8} miw={300} w="fit-content">
            <Group justify="space-between">
              <Text>Name:</Text>
              <Text>{job.employer.name}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Number of workers:</Text>
              <Text>{job.employer.numberOfWorkers}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Average rating:</Text>
              <Text>{job.employer.averageRating}</Text>
            </Group>
          </Stack>
        </Stack>

        <JobApplications jobId={job.id} userId={account.id} />
      </Stack>
    ) : (
      <Text>
        Error!
      </Text>
    )
  );
};

export default JobCard;
