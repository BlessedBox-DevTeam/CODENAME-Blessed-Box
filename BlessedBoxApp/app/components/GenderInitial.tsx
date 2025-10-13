import React, { JSX } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';
import { FEMALE_GENDER_ID, MALE_GENDER_ID } from '../helpers/constants';

interface GenderInitialProps {
  /**
   * @param genderCode - 1 (Male) or 2 (Female).
   */
  genderCode: number;
}

const GenderInitial = ({ genderCode }: GenderInitialProps): JSX.Element => {
  return (
    <View style={[styles.genderContainer]}>
      <View style={[styles.maleContainer, styles.defaultContainer, { backgroundColor: genderCode === MALE_GENDER_ID ? colors.green_label : colors.light_gray }]}>
        <Text style={[commonStyles.paragraphBold, { textAlign: 'center', color: genderCode === MALE_GENDER_ID ? colors.white : colors.dark_gray }]}>{'M'}</Text>
      </View>
      <View style={[styles.femaleContainer, styles.defaultContainer, { backgroundColor: genderCode === FEMALE_GENDER_ID ? colors.red_label : colors.light_gray }]}>
        <Text style={[commonStyles.paragraphBold, { textAlign: 'center', color: genderCode === FEMALE_GENDER_ID ? colors.white : colors.dark_gray }]}>{'F'}</Text>
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
