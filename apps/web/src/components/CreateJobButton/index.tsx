import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';

import CreateJobModal from '../CreateJobModal';

const CreateJobButton = () => {
  const [opened, { close, open }] = useDisclosure();

  return (
    <>
      <CreateJobModal opened={opened} onClose={close} />

      <Button size="sm" onClick={open}>
        Create job +
      </Button>
    </>
  );
};

export default CreateJobButton;
