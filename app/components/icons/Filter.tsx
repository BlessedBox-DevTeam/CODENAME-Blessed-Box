import colors from '@/app/baseStyles/colors';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

export default function Filter({ size = 28, color = colors.dark_gray, onPress = () => {} }) {
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
        <Line x1={4} y1={6} x2={20} y2={6} />
        <Circle cx={8} cy={6} r={2} stroke={color} />
        <Line x1={4} y1={12} x2={20} y2={12} />
        <Circle cx={12} cy={12} r={2} stroke={color} />
        <Line x1={4} y1={18} x2={20} y2={18} />
        <Circle cx={16} cy={18} r={2} stroke={color} />
      </Svg>
    </TouchableOpacity>
  );
}
