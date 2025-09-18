import React, { JSX } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';

interface GenderInitialProps {
  /**
   * @param genderCode - 1 (Female) or 2 (Male).
   */
  genderCode: number;
}

const GenderInitial = ({ genderCode }: GenderInitialProps): JSX.Element => {
  return (
    <View style={[styles.genderContainer]}>
      <View style={[styles.maleContainer, styles.defaultContainer, { backgroundColor: genderCode === 1 ? colors.green_label : colors.light_gray }]}>
        <Text style={[commonStyles.paragraphBold, { textAlign: 'center', color: genderCode === 1 ? colors.white : colors.dark_gray }]}>{'M'}</Text>
      </View>
      <View style={[styles.femaleContainer, styles.defaultContainer, { backgroundColor: genderCode === 0 ? colors.red_label : colors.light_gray }]}>
        <Text style={[commonStyles.paragraphBold, { textAlign: 'center', color: genderCode === 0 ? colors.white : colors.dark_gray }]}>{'F'}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  genderContainer: {
    width: 'auto',
    maxWidth: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.light_gray,
  },
  defaultContainer: {
    padding: 2,
    flex: 1,
  },
  maleContainer: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  femaleContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default GenderInitial;
