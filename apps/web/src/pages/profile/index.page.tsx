import Head from 'next/head';
import { NextPage } from 'next';

import { accountApi } from 'resources/account';

import EmployerUpdateForm from './components/EmployerUpdateForm';
import UserUpdateForm from './components/UserUpdateForm';

const Profile: NextPage = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      {account.employer
        ? <EmployerUpdateForm />
        : <UserUpdateForm />}
    </>
  );
};

export default Profile;
