import React from 'react';
import { Text } from '@react-email/components';

const BodyFooter = () => (
  <Text className="mt-10 text-center text-zinc-500">
    ©
    {' '}
    {new Date().getFullYear()}
    {' '}
    All Rights Reserved
  </Text>
);

export default BodyFooter;
