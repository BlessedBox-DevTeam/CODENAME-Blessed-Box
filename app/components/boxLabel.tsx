import React, { useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import QuantitySelector from './QuantitySelector';

type AgeRange = '2-4' | '5-9' | '10-14';

const BoxLabel = () => {
  const [selected, setSelected] = useState<AgeRange>('2-4');
  const quantitySelectorRef = useRef<{ reset: () => void }>(null);

  // Reusable style for age range buttons
  const getAgeButtonStyle = (range: AgeRange) => ({
    ...styles.ageButton,
    backgroundColor: selected === range ? colors.white : 'transparent',
  });

  // Reusable style for age range text
  const getAgeTextStyle = (
    range: AgeRange,
    isTenthToFourteen: boolean = false
  ) => ({
    ...commonStyles.paragraph,
    color: selected === range ? colors.dark_blue : colors.dark_gray,
    ...(isTenthToFourteen ? {} : styles.ageText),
  });

  const handleReset = () => {
    setSelected('2-4');
    quantitySelectorRef.current?.reset();
  };

  // Render the component
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[commonStyles.card, { gap: 10 }]}>
        {/* Title */}
        <Text style={[commonStyles.header, styles.title]}>Shoebox Label</Text>

        {/* Category Label */}
        <View style={styles.categoryContainer}>
          <Text style={[commonStyles.paragraphExtraBold, styles.categoryText]}>
            Girl
          </Text>
        </View>

        {/* Select Age Label */}
        <Text style={[commonStyles.paragraphBold, styles.labelText]}>
          Select Age
        </Text>

        {/* Age range selection */}
        <View style={styles.ageContainer}>
          <TouchableOpacity
            style={getAgeButtonStyle('2-4')}
            onPress={() => setSelected('2-4')}>
            <Text style={getAgeTextStyle('2-4')}>2-4</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getAgeButtonStyle('5-9')}
            onPress={() => setSelected('5-9')}>
            <Text style={getAgeTextStyle('5-9')}>5-9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getAgeButtonStyle('10-14')}
            onPress={() => setSelected('10-14')}>
            <Text style={getAgeTextStyle('10-14', true)}>
              10
              <Text
                style={{
                  letterSpacing: 2,
                  color: getAgeTextStyle('10-14').color,
                }}>
                -
              </Text>
              14
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quantity Label */}
        <Text style={[commonStyles.paragraphBold, styles.labelText]}>
          Quantity
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}>
          {/* Quantity Selector */}
          <View style={{ flex: 1 }}>
            <QuantitySelector ref={quantitySelectorRef} />
          </View>

          {/* Quantity buttons */}
          <View style={styles.quantityContainer}>
            {['5', '10', '20'].map((qty) => (
              <View key={qty} style={styles.quantityBox}>
                <Text style={commonStyles.paragraph}>{qty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.dark_blue }]}
            onPress={handleReset}>
            <Text
              style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.red }]}>
            <Text style={[commonStyles.paragraphBold, { color: colors.red }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  labelText: {
    color: colors.dark_blue,
  },
  ageContainer: {
    flexDirection: 'row',
    backgroundColor: colors.light_gray,
    borderRadius: 5,
    padding: 2,
    overflow: 'hidden',
    alignItems: 'center',
  },
  ageButton: {
    borderRadius: 5,
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageText: {
    letterSpacing: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 2,
  },
  quantityBox: {
    backgroundColor: colors.light_gray,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BoxLabel;
