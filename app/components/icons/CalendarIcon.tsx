import colors from '@/app/baseStyles/colors';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

export default function CalendarIcon({ size = 28, color = colors.dark_gray, onPress = () => {} }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: size + 16,
        height: size + 16,
        borderRadius: (size + 16) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
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
    </TouchableOpacity>
  );
}
