import { useDisclosure } from '@mantine/hooks';
import { Button, ButtonProps } from '@mantine/core';

import { JobWithEmployer } from 'types';

import { FC } from 'react';
import UpdateJobModal from './UpdateJobModal';

interface UpdateJobButtonProps extends ButtonProps {
  job: JobWithEmployer;
}
const UpdateJobButton: FC<UpdateJobButtonProps> = ({ job, ...rest }) => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <>
      <UpdateJobModal job={job} opened={opened} onClose={close} />

      <Button size="sm" onClick={open} {...rest}>
        Update
      </Button>
    </>
  );
};

export default UpdateJobButton;
