import { FC, useState } from 'react';
import { Select, Group, Button, SelectProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { resumeApi } from 'resources/resume';

import CreateResumeModal from '../CreateResumeModal';

const ResumeSelect: FC<SelectProps> = ({ ...rest }) => {
  const [value, setValue] = useState<string>('');
  const [opened, { close, open }] = useDisclosure();
  const { data: resumes, isLoading, isError } = resumeApi.useList();

  const getSelectData = () => {
    if (isLoading) {
      return [{
        value: '',
        label: 'Loading...',
      }];
    }

    if (!resumes && isError) {
      return [{
        value: '',
        label: 'Error!',
      }];
    }

    if (resumes && !isError) {
      return resumes.items.map((r) => ({ value: String(r.id), label: r.title }));
    }
  };

  return (
    <>
      <CreateResumeModal opened={opened} onClose={close} />

      <Group align="flex-end" w="100%" wrap="nowrap">
        <Select
          label="Select resume"
          w="100%"
          value={value}
          onChange={(val) => setValue(val ?? '')}
          data={getSelectData()}
          {...rest}
        />

        <Button size="sm" w="fit-content" onClick={open}>
          Add resume +
        </Button>
      </Group>
    </>
  );
};

export default ResumeSelect;
