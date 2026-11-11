import React from 'react';
import { Circle, Path, Svg } from 'react-native-svg';

import GiftBoxIcon from '../icons/GiftBoxIcon';
import { Gender } from './orderTypes';

type CategoryIconProps = {
  gender: Gender;
  color: string;
  size?: number;
};

export default function CategoryIcon({ gender, color, size = 22 }: CategoryIconProps) {
  if (gender === 'unlabeled') {
    return <GiftBoxIcon size={size} />;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityRole="image">
      {gender === 'girl' && (
        <>
          <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth="1.8" />
          <Path d="M12 13v9m-4-4h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {gender === 'boy' && (
        <>
          <Circle cx="9" cy="15" r="5" stroke={color} strokeWidth="1.8" />
          <Path
            d="m13 11 7-7m-6 0h6v6"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}
