import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Slider from './Slider';

// Define props type (if needed)
interface GenderTileProps {}

const GenderTile = forwardRef<any, GenderTileProps>((props, ref) => {
  const [gender, setGender] = useState(0);
  const sliderRef = useRef<any>(null);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    reset: () => {
      setGender(0);
      sliderRef.current?.reset?.();
    },
  }));

  // Cambia el texto y color según el sexo seleccionado
  const isGirl = gender === 0;
  const backgroundColor = isGirl ? colors.red_label : colors.green_label;
  const text = isGirl ? 'Girl' : 'Boy';

  return (
    <View style={[genderTileStyles.categoryContainer, { backgroundColor }]}>
      <Text style={[commonStyles.paragraphExtraBold, genderTileStyles.categoryText]}>{text}</Text>
      <Slider ref={sliderRef} onValueChange={setGender}></Slider>
    </View>
  );
});
// Stylesheet for reusable styles
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
