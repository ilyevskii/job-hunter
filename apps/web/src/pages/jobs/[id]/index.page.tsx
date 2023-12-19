import { useRouter } from 'next/router';

import { accountApi } from 'resources/account';

import { JobCard, ViewFeedbackButton } from 'components';

const PublicJobDetails = () => {
  const router = useRouter();

  const { id } = router.query;

  const { data: account } = accountApi.useGet();

  if (!id || Array.isArray(id) || Number.isNaN(+id) || !account) return null;

  return (
    <>
      <JobCard id={+id} />

      {!account.employer && (
        <ViewFeedbackButton jobId={+id} />
      )}
    </>
  );
};

export default PublicJobDetails;
