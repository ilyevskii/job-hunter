import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { RoutePath } from 'routes';

const Home = () => {
  const { replace } = useRouter();

  useEffect(() => {
    replace(RoutePath.Jobs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default Home;
