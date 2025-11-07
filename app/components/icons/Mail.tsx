import colors from '@/app/baseStyles/colors';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MailProps {
  width?: number;
  height?: number;
  color?: string;
}
export default function Mail({ width = 40, height = 40, color = colors.dark_blue, ...props }: MailProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M6.66634 33.3332C5.74967 33.3332 4.95801 33.0137 4.29134 32.3748C3.65245 31.7082 3.33301 30.9165 3.33301 29.9998V9.99984C3.33301 9.08317 3.65245 8.30539 4.29134 7.6665C4.95801 6.99984 5.74967 6.6665 6.66634 6.6665H33.333C34.2497 6.6665 35.0275 6.99984 35.6663 7.6665C36.333 8.30539 36.6663 9.08317 36.6663 9.99984V29.9998C36.6663 30.9165 36.333 31.7082 35.6663 32.3748C35.0275 33.0137 34.2497 33.3332 33.333 33.3332H6.66634ZM19.9997 21.6665L33.333 13.3332V9.99984L19.9997 18.3332L6.66634 9.99984V13.3332L19.9997 21.6665Z"
        fill={color}
      />
    </Svg>
  );
}
