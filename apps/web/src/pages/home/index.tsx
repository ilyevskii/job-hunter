import { useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  Flex,
} from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { IconSearch, IconX, IconSelector } from '@tabler/icons-react';
import { RowSelectionState, SortingState } from '@tanstack/react-table';

import { jobApi } from 'resources/job';

import { Table } from 'components';

import { PER_PAGE, columns, selectOptions } from './constants';

import classes from './index.module.css';

interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'ASC' | 'DESC';
  };
}

const Home: NextPage = () => {
  const [search, setSearch] = useInputState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortBy, setSortBy] = useState(selectOptions[0].value);

  const [params, setParams] = useState<UsersListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: 'DESC' } : { createdOn: 'ASC' },
    }));
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = jobApi.useList(params);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Stack gap="lg">
        <Title order={2}>Jobs</Title>

        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap">
            <Skeleton
              className={classes.inputSkeleton}
              height={42}
              radius="sm"
              visible={isListLoading}
              width="auto"
            >
              <TextInput
                w={350}
                size="md"
                value={search}
                onChange={setSearch}
                placeholder="Search by title"
                leftSection={<IconSearch size={16} />}
                rightSection={search ? (
                  <UnstyledButton
                    component={Flex}
                    display="flex"
                    align="center"
                    onClick={() => setSearch('')}
                  >
                    <IconX color="gray" />
                  </UnstyledButton>
                ) : null}
              />
            </Skeleton>

            <Skeleton
              width="auto"
              height={42}
              radius="sm"
              visible={isListLoading}
            >
              <Select
                w={200}
                size="md"
                data={selectOptions}
                value={sortBy}
                onChange={handleSort}
                rightSection={<IconSelector size={16} />}
                comboboxProps={{
                  withinPortal: false,
                  transitionProps: {
                    transition: 'pop-bottom-right',
                    duration: 210,
                    timingFunction: 'ease-out',
                  },
                }}
              />
            </Skeleton>
          </Group>
        </Group>

        {isListLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={`sklton-${String(item)}`}
                height={50}
                radius="sm"
                mb="sm"
              />
            ))}
          </>
        )}

        {data?.items.length ? (
          <Table
            columns={columns}
            data={data.items}
            dataCount={data.count}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            onSortingChange={setSorting}
            onPageChange={setParams}
            perPage={PER_PAGE}
          />
        ) : (
          <Container p={75}>
            <Text size="xl" c="gray">
              No results found, try to adjust your search.
            </Text>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default Home;
