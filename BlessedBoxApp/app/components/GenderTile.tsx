import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Slider from './Slider';

/**
 * Props for the GenderTile component.
 *
 * (Currently no props are required, but this type can be extended.)
 */
interface GenderTileProps {}

/**
 * GenderTile component.
 *
 * Displays a gender selector with a slider. The background color and
 * text change based on the selected gender:
 * - Girl → red background, "Girl"
 * - Boy → green background, "Boy"
 *
 * Exposes a `reset` method via `ref` to reset its state and the slider.
 *
 * @component
 * @example
 * ```tsx
 * const ref = useRef<{ reset: () => void }>(null);
 *
 * <GenderTile ref={ref} />
 *
 * // Reset from parent
 * ref.current?.reset();
 * ```
 *
 * @param {GenderTileProps} props - Component props (currently none).
 * @param {React.Ref<{ reset: () => void }>} ref - Ref to expose reset method.
 * @returns {JSX.Element} React component.
 */
const GenderTile = forwardRef<any, GenderTileProps>((props, ref) => {
  /** Gender state (0 = Girl, 1 = Boy) */
  const [gender, setGender] = useState(0);

  /** Ref to control the Slider child component */
  const sliderRef = useRef<any>(null);

  /**
   * Expose reset method to parent components through the forwarded ref.
   * Resets gender state and child Slider.
   */
  useImperativeHandle(ref, () => ({
    reset: () => {
      setGender(0);
      sliderRef.current?.reset?.();
    },
  }));

  /** Whether current gender is "Girl" */
  const isGirl = gender === 0;

  /** Background color depending on gender */
  const backgroundColor = isGirl ? colors.red_label : colors.green_label;

  /** Displayed text depending on gender */
  const text = isGirl ? 'Girl' : 'Boy';

  return (
    <View style={[genderTileStyles.categoryContainer, { backgroundColor }]}>
      <Text style={[commonStyles.paragraphExtraBold, genderTileStyles.categoryText]}>{text}</Text>
      <Slider ref={sliderRef} onValueChange={setGender}></Slider>
    </View>
  );
});

const genderTileStyles = StyleSheet.create({
  title: {
    color: colors.red,
    textTransform: 'uppercase',
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.red_label,
    width: '100%',
    borderRadius: 10,
    padding: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  categoryText: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

export default GenderTile;
