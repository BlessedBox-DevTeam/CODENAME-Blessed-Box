import colors from '@/app/baseStyles/colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

interface CalendarIconProps {
  size?: number;
  color?: string;
  active?: boolean;
  onPress?: () => void;
}

export default function CalendarIcon({
  size = 28,
  color = colors.text.secondary,
  active = false,
  onPress = () => {},
}: CalendarIconProps) {
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
        {/* Cuerpo del calendario */}
        <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />

        {/* Colgadores */}
        <Line x1={16} y1={2} x2={16} y2={6} />
        <Line x1={8} y1={2} x2={8} y2={6} />

        {/* Separación cabecera */}
        <Line x1={3} y1={10} x2={21} y2={10} />

        {/* Cuadritos dentro */}
        <Rect x={6} y={12.5} width={2} height={2} fill={color} />
        <Rect x={11} y={12.5} width={2} height={2} fill={color} />
        <Rect x={16} y={12.5} width={2} height={2} fill={color} />

        <Rect x={6} y={17.5} width={2} height={2} fill={color} />
        <Rect x={11} y={17.5} width={2} height={2} fill={color} />
        <Rect x={16} y={17.5} width={2} height={2} fill={color} />
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
