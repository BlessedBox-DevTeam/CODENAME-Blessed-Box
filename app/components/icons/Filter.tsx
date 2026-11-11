import colors from '@/app/baseStyles/colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

interface FilterProps {
  size?: number;
  color?: string;
  active?: boolean;
  onPress?: () => void;
}

export default function Filter({
  size = 28,
  color = colors.text.secondary,
  active = false,
  onPress = () => {},
}: FilterProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: size + 16,
        height: size + 16,
        borderRadius: (size + 16) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface.card,
        borderWidth: 0.75,
        borderColor: colors.effects.greenBorder,
      }}
      activeOpacity={0.7}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Line x1={4} y1={6} x2={20} y2={6} />
        <Circle cx={8} cy={6} r={2} stroke={color} />
        <Line x1={4} y1={12} x2={20} y2={12} />
        <Circle cx={12} cy={12} r={2} stroke={color} />
        <Line x1={4} y1={18} x2={20} y2={18} />
        <Circle cx={16} cy={18} r={2} stroke={color} />
      </Svg>
      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = {
  activeIndicator: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.surface.card,
    backgroundColor: colors.accent.gold,
  },
};
