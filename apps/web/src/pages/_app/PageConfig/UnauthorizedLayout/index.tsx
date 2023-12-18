import { FC, ReactElement } from 'react';
import { Center } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <Center px={32} w="100%" h="100vh" component="main">
    {children}
  </Center>
);

export default UnauthorizedLayout;
