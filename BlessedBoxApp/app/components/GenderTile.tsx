import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

const GenderTile = () => {
  return (
    <View style={[commonStyles.card, { gap: 10 }]}>
      {/* Category Label */}
      <View style={styles.categoryContainer}>
        <Text style={[commonStyles.paragraphExtraBold]}>Girl</Text>
      </View>
    </View>
  );
};
// Stylesheet for reusable styles
const styles = StyleSheet.create({
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
