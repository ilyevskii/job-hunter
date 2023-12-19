import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, ButtonProps } from '@mantine/core';

import ApplyJobModal from '../ApplyJobModal';

interface ApplyJobButtonProps extends ButtonProps {
  jobId: number;
}

const ApplyJobButton: FC<ApplyJobButtonProps> = ({ jobId, ...rest }) => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <>
      <ApplyJobModal jobId={jobId} opened={opened} onClose={close} />

      <Button size="md" mt={48} fullWidth onClick={open} {...rest}>
        Apply job
      </Button>
    </>
  );
};

export default ApplyJobButton;
