import { FC } from 'react';
import { Modal, Button, Title, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { feedbackApi } from 'resources/feedback';

import ApplyJobButton from '../ApplyJobButton';

interface ViewFeedbackButtonProps {
  jobId: number;
}

const ViewFeedbackButton: FC<ViewFeedbackButtonProps> = ({ jobId }) => {
  const [opened, { close, open }] = useDisclosure();

  const { data: feedback } = feedbackApi.useGet(jobId);

  return (
    <>
      <Modal
        title="Feedback"
        opened={opened}
        onClose={close}
      >
        {feedback && (
          <Stack>
            <Title order={2}>
              {feedback.status.toLowerCase()}
            </Title>

              {feedback.feedback ? (
                <Text>
                  {feedback.feedback.content}
                </Text>
              ) : (
                <Text>
                  Waiting for the feedback...
                </Text>
              )}
          </Stack>
        )}
      </Modal>

      {!feedback ? (
        <ApplyJobButton jobId={jobId} />
      ) : (
        <Button size="md" fullWidth mt={48} onClick={open}>
          View feedback
        </Button>
      )}
    </>
  );
};

export default ViewFeedbackButton;
