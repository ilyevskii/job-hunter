import { FC } from 'react';
import {
  Modal,
  Button,
  Stack,
  TextInput,
  Textarea,
  ModalProps,
} from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { resumeApi } from 'resources/resume';

import { handleError } from 'utils';
import queryClient from 'query-client';

const schema = z.object({
  title: z.string().min(1, 'Please enter resume title').max(255),
  content: z.string().min(1, 'Please enter resume content').max(10_000),
});

type CreateResumeParams = z.infer<typeof schema>;

const CreateResumeModal: FC<ModalProps> = ({ ...rest }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateResumeParams>({
    resolver: zodResolver(schema),
  });

  const { mutate: create, isLoading: isCreateLoading } = resumeApi.useCreate<CreateResumeParams>();

  const onSubmit = (data: CreateResumeParams) => create(data, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('resumes');

      rest.onClose();
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Modal
      title="Create new resume"
      {...rest}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={20}>
          <TextInput
            {...register('title')}
            label="Title"
            maxLength={100}
            placeholder="Title"
            error={errors.title?.message}
          />

          <Textarea
            {...register('content')}
            label="Content"
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
  );
};

export default CreateResumeModal;
