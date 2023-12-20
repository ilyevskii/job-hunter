import { FC } from 'react';
import { z } from 'zod';
import { Modal, Button, Select, Stack, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { feedbackApi } from 'resources/feedback';

import { handleError } from 'utils';

interface CreateFeedbackButtonProps {
  applicationId: number;
}

const schema = z.object({
  content: z.string().min(1, 'Please enter job title').max(255),
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

type CreateFeedbackParams = z.infer<typeof schema>;

const CreateFeedbackButton: FC<CreateFeedbackButtonProps> = ({ applicationId }) => {
  const [opened, { close, open }] = useDisclosure();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<CreateFeedbackParams>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: create,
    isLoading: isCreateLoading,
  } = feedbackApi.useCreate<CreateFeedbackParams & { applicationId: number; status: 'DECLINED' | 'ACCEPTED' }>();

  const onSubmit = (data: CreateFeedbackParams) => create({
    ...data,
    applicationId,
  }, {
    onSuccess: close,
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Modal
        title="Add feedback"
        opened={opened}
        onClose={close}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={20}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  data={[
                    {
                      value: 'ACCEPTED',
                      label: 'Accept',
                    },
                    {
                      value: 'DECLINED',
                      label: 'Decline',
                    },
                  ]}
                  error={errors.status?.message}
                />
              )}
            />

            <Textarea
              {...register('content')}
              label="Content"
              styles={{ label: { fontSize: 18, fontWeight: 600 } }}
              size="md"
              maxLength={10000}
              placeholder="Content"
              error={errors.content?.message}
            />
          </Stack>

          <Button
            type="submit"
            loading={isCreateLoading}
            fullWidth
            mt={34}
          >
            Create
          </Button>
        </form>
      </Modal>

      <Button size="md" onClick={open}>
        Add feedback
      </Button>
    </>
  );
};

export default CreateFeedbackButton;
