import React, { JSX } from 'react';
import { Text } from 'react-native';

interface GenderInitialProps {
  /**
   * @param genderCode - 1 (Female) or 2 (Male).
   */
  genderCode: number;
}

const GenderInitial = ({ genderCode }: GenderInitialProps): JSX.Element => {
  return <Text>{genderCode === 1 ? 'F' : 'M'}</Text>;
};

export default GenderInitial;
