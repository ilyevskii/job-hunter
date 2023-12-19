import { memo, FC } from 'react';
import { AppShellHeader as LayoutHeader, Container, Group } from '@mantine/core';

import { accountApi } from 'resources/account';

import { Link, CreateJobButton } from 'components';
import { RoutePath } from 'routes';

import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';

import classes from './index.module.css';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <LayoutHeader>
      <Container
        className={classes.header}
        mih={72}
        px={32}
        py={0}
        display="flex"
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>

        {account.employer?.name ? (
          <Group gap={50}>
            <CreateJobButton />
            <UserMenu />
          </Group>
        ) : <UserMenu />}

      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
