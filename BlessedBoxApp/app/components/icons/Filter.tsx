import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Filter({ size = 28, color = '#000', onPress = () => {} }) {
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
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 21h16" />
        <Path d="M4 17h10" />
        <Path d="M4 13h6" />
        <Path d="M4 9h8" />
        <Path d="M4 5h16" />
        <Path d="M15 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
        <Path d="M9 13a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
        <Path d="M11 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
      </Svg>
    </TouchableOpacity>
  );
}
