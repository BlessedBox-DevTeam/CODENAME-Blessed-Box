import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import commonStyles from '../../baseStyles/baseStyles';
import colors from '../../baseStyles/colors';

interface BackArrowProps {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BackArrow({
  width = 24,
  height = 24,
  color = colors.dark_blue,
  label,
  onPress,
  style,
}: BackArrowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, label && styles.labeledButton, style]}
      hitSlop={10}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label ? `${label} navigation` : 'Back'}>
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 12H4m0 0 7-7m-7 7 7 7"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {label ? (
        <Text style={[commonStyles.paragraphBold, styles.label, { color }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labeledButton: {
    width: 76,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  label: {
    lineHeight: 20,
  },
});
