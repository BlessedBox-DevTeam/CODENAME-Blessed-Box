import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

const GenderTile = () => {
  return (
    <View style={genderTileStyles.categoryContainer}>
      <Text
        style={[
          commonStyles.paragraphExtraBold,
          genderTileStyles.categoryText,
        ]}>
        Girl
      </Text>
    </View>
  );
};
// Stylesheet for reusable styles
const genderTileStyles = StyleSheet.create({
  title: {
    color: colors.red,
    textTransform: 'uppercase',
  },
  categoryContainer: {
    backgroundColor: colors.red_label,
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  categoryText: {
    color: colors.white,
    textTransform: 'uppercase',
  },
});
export default GenderTile;
