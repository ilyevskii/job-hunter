import { z } from 'zod';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { NextPage } from 'next';
import { Button, TextInput, PasswordInput, Stack, Title, NumberInput } from '@mantine/core';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';
import { RoutePath } from 'routes';

import { PASSWORD_REGEX } from 'app-constants';

import PhotoUpload from '../PhotoUpload';
import classes from '../index.module.css';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  location: z.string().min(1, 'Please enter location').max(100),
  numberOfWorkers: z.number().positive('Please enter number of workers').max(100_000),
  password: z.string().regex(
    PASSWORD_REGEX,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ).or(z.literal('')).optional()
    .nullable(),
});

type UpdateParams = z.infer<typeof schema>;

const Profile: NextPage = () => {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<UpdateParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: account?.employer?.name ?? '',
      location: account?.employer?.location ?? '',
      numberOfWorkers: account?.employer?.numberOfWorkers ?? 0,
    },
  });

  const {
    mutate: updateCurrent,
    isLoading: isUpdateLoading,
  } = accountApi.useEmployerUpdate<UpdateParams>();

  const onSubmit = (submitData: UpdateParams) => updateCurrent(submitData, {
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);

      showNotification({
        title: 'Success',
        message: 'Your profile has been successfully updated.',
        color: 'green',
      });

      push(RoutePath.Home);
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <Stack
      w={408}
      m="auto"
      pt={48}
      gap={32}
    >
      <Title order={1}>Profile</Title>
      <PhotoUpload />

      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack gap={20}>
          <TextInput
            {...register('name')}
            label="Name"
            placeholder="Name"
            labelProps={{
              'data-invalid': !!errors.name,
            }}
            error={errors.name?.message}
          />

          <TextInput
            {...register('location')}
            label="Location"
            placeholder="Location"
            labelProps={{
              'data-invalid': !!errors.location,
            }}
            error={errors.location?.message}
          />

          <Controller
            name="numberOfWorkers"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Number of workers"
                max={100000}
                placeholder="Number of workers"
                error={errors.numberOfWorkers?.message}
              />
            )}
          />

          <TextInput
            label="Email Address"
            defaultValue={account?.email}
            disabled
          />

          <PasswordInput
            {...register('password')}
            label="Password"
            placeholder="Enter password"
            labelProps={{
              'data-invalid': !!errors.password,
            }}
            error={errors.password?.message}
          />
        </Stack>

        <Button
          type="submit"
          loading={isUpdateLoading}
        >
          Update Profile
        </Button>
      </form>
    </Stack>
  );
};

export default Profile;
