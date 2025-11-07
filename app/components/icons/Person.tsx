import colors from '@/app/baseStyles/colors';
import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Person({ width = 40, height = 40, color = colors.dark_gray }) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
        <Path
          d="M20.0004 15.9509C24.3687 15.9509 27.9099 12.3802 27.9099 7.97547C27.9099 3.57074 24.3687 0 20.0004 0C15.632 0 12.0908 3.57074 12.0908 7.97547C12.0908 12.3802 15.632 15.9509 20.0004 15.9509Z"
          fill={color}
        />
        <Path d="M23.4968 19.8311H16.5024C11.8735 19.8311 8.12012 23.6147 8.12012 28.2839V40.0002H31.8791V28.2839C31.8791 23.6147 28.1257 19.8311 23.4968 19.8311Z" fill={color} />
      </Svg>
    </View>
  );
}
