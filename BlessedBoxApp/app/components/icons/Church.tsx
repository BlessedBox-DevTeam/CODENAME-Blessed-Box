import colors from '@/app/baseStyles/colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChurchProps {
  width?: number;
  height?: number;
  color?: string;
}
export default function Church({ width = 40, height = 41, color = colors.dark_blue, ...props }: ChurchProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 41" fill="none" {...props}>
      <Path d="M32.6943 27.1133V39.1013V39.141H40V31.3361L32.6943 27.1133Z" fill={color} />
      <Path d="M0 39.1405H7.30568V39.1008V27.1035L0 31.3356V39.1405Z" fill={color} />
      <Path
        d="M8.5957 23.0241V39.1012H16.0856V32.2851C16.0856 30.1473 17.8188 28.4141 19.9566 28.4141H20.0428C22.1806 28.4141 23.9138 30.1473 23.9138 32.2851V39.1012H31.4037V23.0241L19.9997 13.5645L8.5957 23.0241Z"
        fill={color}
      />
      <Path
        d="M3.54883 21.35L5.4838 23.6981L20.0002 11.7365L34.5166 23.6981L36.4515 21.35L20.9034 8.53834V5.68737H23.6945V3.88092H20.9034V1.85938H19.097V3.88092H16.3059V5.68737H19.097V8.53834L3.54883 21.35Z"
        fill={color}
      />
    </Svg>
  );
}
