import { FC } from 'react';
import {
  Modal,
  Button,
  Stack,
  Text,
  RangeSlider,
  Group,
  TextInput,
  NumberInput,
  Textarea,
  ModalProps,
} from '@mantine/core';
import { z } from 'zod';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { jobApi } from '../../resources/job';

import { handleError } from '../../utils';
import queryClient from '../../query-client';

import { JobWithEmployer } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Please enter job title').max(255),
  description: z.string().min(1, 'Please job description').max(1_000),
  location: z.string().min(1, 'Please job description').max(255),
  salaryFrom: z.number().nonnegative().min(0, 'Please enter salary from'),
  salaryTo: z.number().nonnegative().min(0, 'Please enter salary to').max(1_000_000),
});

type UpdateJobParams = z.infer<typeof schema>;

interface UpdateJobModalProps extends ModalProps {
  job: JobWithEmployer;
}
const UpdateJobModal: FC<UpdateJobModalProps> = ({ job, ...rest }) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<UpdateJobParams>({
    resolver: zodResolver(schema),
    defaultValues: job as any,
  });

  const { mutate: update, isLoading: isUpdateLoading } = jobApi.useUpdate<UpdateJobParams>(job.id);

  const { field: fieldFrom } = useController({ control, name: 'salaryFrom' });
  const { field: fieldTo } = useController({ control, name: 'salaryTo' });

  const onSubmit = (data: UpdateJobParams) => update(data, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('jobs');

      rest.onClose();
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Modal
      title={`Update ${job.title}`}
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
            {...register('description')}
            label="Description"
            styles={{ label: { fontSize: 18, fontWeight: 600 } }}
            size="md"
            maxLength={2500}
            placeholder="Description"
            error={errors.description?.message}
          />

          <TextInput
            {...register('location')}
            label="Location"
            placeholder="Location"
            error={errors.location?.message}
          />

          <Stack gap="xs">
            <Text>
              Salary Range
            </Text>

            <RangeSlider
              label={null}
              min={0}
              max={1000000}
              step={1000}
              value={[+fieldFrom.value, +fieldTo.value]}
              onChange={(value) => {
                fieldFrom.onChange(Number.isNaN(value[0]) ? 0 : value[0]);
                fieldTo.onChange(Number.isNaN(value[1]) ? 0 : value[1]);
              }}
            />
          </Stack>

          <Group grow align="flex-start">
            <NumberInput
              {...fieldFrom}
              min={0}
              max={1000000}
              styles={{ label: { fontSize: 18, fontWeight: 600 } }}
              size="md"
              label="From"
              placeholder="From"
              maxLength={7}
              error={errors.salaryFrom?.message}
            />

            <NumberInput
              {...fieldTo}
              min={0}
              max={1000000}
              styles={{ label: { fontSize: 18, fontWeight: 600 } }}
              size="md"
              label="To"
              placeholder="To"
              maxLength={7}
              error={errors.salaryFrom?.message}
            />
          </Group>
        </Stack>

        <Button
          type="submit"
          loading={isUpdateLoading}
          fullWidth
          mt={34}
        >
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateJobModal;
