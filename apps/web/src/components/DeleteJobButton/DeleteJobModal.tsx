import { FC } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Text, Group, ModalProps } from '@mantine/core';

import { jobApi } from 'resources/job';

import { handleError } from 'utils';
import { RoutePath } from 'routes';
import queryClient from 'query-client';

import { JobWithEmployer } from 'types';

interface DeleteJobModalProps extends ModalProps {
  job: JobWithEmployer;
}

const DeleteJobModal: FC<DeleteJobModalProps> = ({ job, ...rest }) => {
  const { replace } = useRouter();

  const { mutate: deleteJob, isLoading: isDeleteLoading } = jobApi.useDelete(job.id);

  const onSubmit = () => {
    deleteJob({}, {
      onError: (e) => handleError(e),
    });

    replace(RoutePath.Home);
  };

  return (
    <Modal
      title={`Delete ${job.title}`}
      {...rest}
    >
      <form onSubmit={() => onSubmit()}>
        <Text>
          Are you sure you want to delete &quot;
          {job.title}
          &quot; job?
        </Text>

        <Group mt={34} wrap="nowrap">
          <Button
            variant="outline"
            onClick={rest.onClose}
            fullWidth
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isDeleteLoading}
            fullWidth
          >
            Delete
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default DeleteJobModal;
