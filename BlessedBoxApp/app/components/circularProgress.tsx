import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { commonStyles } from '../baseStyles/baseStyles';

export const CircularProgress = ({ percentage }) => {
  const radius = 40;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={commonStyles.container}>
      <Svg height="100" width="100">
        {/* Fondo gris */}
        <Circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          cx="50"
          cy="50"
          r={normalizedRadius}
        />
        {/* Progreso verde */}
        <Circle
          stroke="#009639"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          cx="50"
          cy="50"
          r={normalizedRadius}
          rotation="-90"
          origin="50, 50"
        />
      </Svg>
      {/* Texto al centro */}
      <View style={commonStyles.textContainer}>
        <Text style={commonStyles.header}>{`${percentage}%`}</Text>
      </View>
    </View>
  );
};
