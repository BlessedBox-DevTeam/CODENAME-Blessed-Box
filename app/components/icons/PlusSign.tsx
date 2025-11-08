import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import colors from '@/app/baseStyles/colors';

interface PlusSignProps {
  width?: number;
  height?: number;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function PlusSign({ width = 25, height = 25, color = colors.dark_gray, onPress, style }: PlusSignProps) {
  return (
    <Pressable onPress={onPress} style={[{ justifyContent: 'center', alignItems: 'center' }, style]} hitSlop={10}>
      <Svg width={width} height={height} viewBox="0 0 24 24">
        <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}
