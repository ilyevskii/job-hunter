import React from 'react';
import { Column, Text, Row, Section } from '@react-email/components';

const Header = () => (
  <>
    <Row className="p-6">
      <Text>
        DB Lab
      </Text>
    </Row>

    <Section className="flex w-full">
      <Row>
        <Column className="border-b-0 border-solid border-gray-100 w-60" />
        <Column className="border-b-0 border-solid border-black w-32" />
        <Column className="border-b-0 border-solid border-gray-100 w-60" />
      </Row>
    </Section>
  </>
);

export default Header;
