import { FC } from 'react';
import { Modal, Button, Title, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { resumeApi } from 'resources/resume';

interface ViewResumeButtonProps {
  resumeId: number;
}

const ViewResumeButton: FC<ViewResumeButtonProps> = ({ resumeId }) => {
  const [opened, { close, open }] = useDisclosure();

  const { data: resume } = resumeApi.useGet(resumeId);

  return (
    <>
      <Modal
        title={resume?.user.firstName ? `${resume?.user.firstName}'s resume` : 'Resume'}
        opened={opened}
        onClose={close}
      >
        {resume && (
          <Stack>
            <Title order={2}>
              {resume.title}
            </Title>

            <Text>
              {resume.content}
            </Text>
          </Stack>
        )}

        {!resume && 'Error!'}
      </Modal>

      <Button size="md" onClick={open}>
        View resume
      </Button>
    </>
  );
};

export default ViewResumeButton;
