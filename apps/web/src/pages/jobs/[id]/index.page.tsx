import { useRouter } from 'next/router';

import { JobCard } from 'components';

const PublicJobDetails = () => {
  const router = useRouter();

  const { id } = router.query;

  if (!id || Array.isArray(id) || Number.isNaN(+id)) return null;

  return (
    <JobCard id={+id} />
  );
};

export default PublicJobDetails;
