import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import GenderTile from './GenderTile';
import QuantitySelector from './QuantitySelector';
import { BoxLabelInfo } from '../types/BoxLabelInfo';
import { TWO_TO_FOUR_YEARS_ID, FIVE_TO_NINE_YEARS_ID, TEN_TO_FOURTEEN_YEARS_ID } from '../helpers/constants';

/**
 * Props for the BoxLabel component.
 */
interface BoxLabelProps {
  /**
   * Optional callback fired when the "Delete" button is pressed.
   */
  onDelete?: () => void;
  error?: string;
}
export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
/**
 * Valid age ranges available in the component.
 */
type AgeRange = typeof TWO_TO_FOUR_YEARS_ID | typeof FIVE_TO_NINE_YEARS_ID | typeof TEN_TO_FOURTEEN_YEARS_ID;

/**
 * Shoebox Label component.
 *
 * Displays gender selection, age range selection,
 * quantity input, and reset/delete actions.
 *
 * @param {BoxLabelProps} props - The component props.
 * @returns {JSX.Element} React component.
 */
const BoxLabel = forwardRef<BoxLabelType, BoxLabelProps>(({ onDelete, error }, ref) => {
  /** Current selected age range */
  const [selected, setSelected] = useState<number>(TWO_TO_FOUR_YEARS_ID);
  /** Ref to control the QuantitySelector child component */
  const quantitySelectorRef = useRef<{ getQuantity: () => number; reset: () => void }>(null);
  /** Ref to control the GenderTile child component */
  const genderTileRef = useRef<{ getGender: () => number; reset: () => void }>(null);

  /**
   * Get the button style for a given age range.
   *
   * @param {AgeRange} range - The age range.
   * @returns {object} Style object for the button.
   */
  const getAgeButtonStyle = (range: AgeRange) => ({
    ...styles.ageButton,
    backgroundColor: selected === range ? colors.white : 'transparent',
  });

  /**
   * Get the text style for a given age range.
   *
   * @param {AgeRange} range - The age range.
   * @param {boolean} [isTenthToFourteen=false] - Special flag for the "10-14" case.
   * @returns {object} Style object for the text.
   */
  const getAgeTextStyle = (range: AgeRange, isTenthToFourteen: boolean = false) => ({
    ...commonStyles.paragraph,
    color: selected === range ? colors.dark_blue : colors.dark_gray,
    ...(isTenthToFourteen ? {} : styles.ageText),
  });

  /**
   * Reset the component state and children to defaults.
   */
  const handleReset = () => {
    setSelected(TWO_TO_FOUR_YEARS_ID);
    quantitySelectorRef.current?.reset();
    genderTileRef.current?.reset();
  };

  // Exponer getData al padre
  useImperativeHandle(ref, () => ({
    getData: (): BoxLabelInfo => ({
      boxAgeId: selected,
      quantity: Number(quantitySelectorRef.current?.getQuantity() ?? 0),
      genderId: genderTileRef.current?.getGender?.() ?? false,
    }),
  }));
  return (
    <View style={[commonStyles.card, { gap: 10 }]}>
      {/* Title */}
      <Text style={[commonStyles.header, styles.title]}>Shoebox Label</Text>

      {/* Gender Selector */}
      <GenderTile ref={genderTileRef}></GenderTile>

      {/* Age Label */}
      <Text style={[commonStyles.paragraphBold, styles.labelText]}>Select Age</Text>

      {/* Age range selection */}
      <View style={styles.ageContainer}>
        <TouchableOpacity
          style={getAgeButtonStyle(TWO_TO_FOUR_YEARS_ID)}
          onPress={() => {
            Keyboard.dismiss();
            setSelected(TWO_TO_FOUR_YEARS_ID);
          }}>
          <Text style={getAgeTextStyle(TWO_TO_FOUR_YEARS_ID)}>2-4</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getAgeButtonStyle(FIVE_TO_NINE_YEARS_ID)}
          onPress={() => {
            Keyboard.dismiss();
            setSelected(FIVE_TO_NINE_YEARS_ID);
          }}>
          <Text style={getAgeTextStyle(FIVE_TO_NINE_YEARS_ID)}>5-9</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getAgeButtonStyle(TEN_TO_FOURTEEN_YEARS_ID)}
          onPress={() => {
            Keyboard.dismiss();
            setSelected(TEN_TO_FOURTEEN_YEARS_ID);
          }}>
          <Text style={getAgeTextStyle(TEN_TO_FOURTEEN_YEARS_ID, true)}>
            10
            <Text
              style={{
                letterSpacing: 2,
                color: getAgeTextStyle(TEN_TO_FOURTEEN_YEARS_ID).color,
              }}>
              -
            </Text>
            14
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quantity Label */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={[commonStyles.paragraphBold, styles.labelText]}>Quantity</Text>
        {error ? <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text> : null}
      </View>

      {/* Quantity Selector */}
      <QuantitySelector ref={quantitySelectorRef} />
      <Text style={[styles.instructionText]}>Write a number or use the buttons</Text>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.dark_blue }]} onPress={handleReset}>
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.red }]} onPress={onDelete}>
          <Text style={[commonStyles.paragraphBold, { color: colors.red }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Stylesheet
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
  instructionText: {
    fontSize: 11,
    color: colors.dark_gray,
    fontFamily: 'OpenSans-SemiBold',
    fontStyle: 'normal',
    fontWeight: 600,
  },
});

export default BoxLabel;
