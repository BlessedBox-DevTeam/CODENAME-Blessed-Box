import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

interface ClockProps {
  width?: number;
  height?: number;
  color?: string;
}
export default function Clock({ width = 40, height = 40, color = '#213758' }: ClockProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Circle cx={20} cy={20} r={18} stroke={color} strokeWidth={3} />
      <Line x1={20} y1={20} x2={20} y2={10} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Line x1={20} y1={20} x2={28} y2={20} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
