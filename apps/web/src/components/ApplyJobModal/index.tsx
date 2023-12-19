import { FC } from 'react';
import { Modal, Button, ModalProps } from '@mantine/core';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { applicationApi } from 'resources/application';

import { handleError } from 'utils';
import queryClient from 'query-client';

import ResumeSelect from '../ResumeSelect';

const schema = z.object({
  resumeId: z.string().min(1, 'Please choose resume'),
});

type ApplyJobParams = z.infer<typeof schema>;

interface ApplyJobModalProps extends ModalProps {
  jobId: number;
}

const ApplyJobModal: FC<ApplyJobModalProps> = ({ jobId, ...rest }) => {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ApplyJobParams>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: create,
    isLoading: isCreateLoading,
  } = applicationApi.useCreate<ApplyJobParams & { jobId: number }>();

  const onSubmit = (data: ApplyJobParams) => create({
    ...data,
    jobId,
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('applications');

      rest.onClose();
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Modal
      title="Apply job"
      {...rest}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="resumeId"
          control={control}
          render={({ field }) => (
            <ResumeSelect
              {...field}
              error={errors.resumeId?.message}
            />
          )}
        />

        <Button
          type="submit"
          loading={isCreateLoading}
          fullWidth
          mt={34}
        >
          Apply
        </Button>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
