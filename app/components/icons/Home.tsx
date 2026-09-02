import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Home = ({ width = 40, height = 40, stroke = '#213758', strokeWidth = 2, fill = 'none', ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 12l9-9 9 9" />
    <Path d="M4 12v8a2 2 0 0 0 2 2h4v-6h4v6h4a2 2 0 0 0 2-2v-8" />
  </Svg>
);

export default Home;
