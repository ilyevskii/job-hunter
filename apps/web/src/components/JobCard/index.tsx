import { FC } from 'react';
import { Loader, Stack, Title, Text, Group } from '@mantine/core';

import { jobApi } from 'resources/job';

interface JobCardProps {
  id: number;
}

const JobCard: FC<JobCardProps> = ({ id }) => {
  const { data, isLoading } = jobApi.useGet(id);

  if (isLoading) return <Loader size={40} />;

  return (
    data ? (
      <Stack gap={48}>
        <Title order={1}>
          {data.title}
        </Title>

        <Group justify="space-between" align="flex-start">
          <Stack gap={16} w="40%">
            <Text fw={900} fz={16}>
              Description
            </Text>

            <Text c="gray.8">
              {data.description}
            </Text>
          </Stack>

          <Stack gap={16} w="20%">
            <Text fw={900} fz={16}>
              Salary
            </Text>

            <Text c="gray.8">
              {data.salaryFrom}
              {' '}
              -
              {' '}
              {data.salaryTo}
              {' '}
              $
            </Text>
          </Stack>

          <Stack gap={16} w="20%">
            <Text fw={900} fz={16}>
              Location
            </Text>

            <Text c="gray.8">
              {data.location}
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
              <Text>{data.employer.name}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Number of workers:</Text>
              <Text>{data.employer.numberOfWorkers}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Average rating:</Text>
              <Text>{data.employer.averageRating}</Text>
            </Group>
          </Stack>
        </Stack>
      </Stack>
    ) : (
      <Text>
        Error!
      </Text>
    )
  );
};

export default JobCard;
