import { useDisclosure } from '@mantine/hooks';
import { Button, ButtonProps } from '@mantine/core';

import { JobWithEmployer } from 'types';

import { FC } from 'react';
import DeleteJobModal from './DeleteJobModal';

interface DeleteJobButtonProps extends ButtonProps {
  job: JobWithEmployer;
}
const DeleteJobButton: FC<DeleteJobButtonProps> = ({ job, ...rest }) => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <>
      <DeleteJobModal job={job} opened={opened} onClose={close} />

      <Button size="sm" onClick={open} {...rest}>
        Delete
      </Button>
    </>
  );
};

export default DeleteJobButton;
