import React from 'react';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

import colors from '../../baseStyles/colors';
import { Gender } from './orderTypes';

type CategoryIconProps = {
  gender: Gender;
  color: string;
  size?: number;
};

export default function CategoryIcon({ gender, color, size = 22 }: CategoryIconProps) {
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
      {gender === 'unlabeled' && (
        <>
          <Rect x="3" y="10" width="18" height="11" rx="1.5" fill={colors.green_label} />
          <Rect x="2" y="7" width="20" height="5" rx="1" fill={colors.graphicRed} />
          <Rect x="2" y="10.5" width="20" height="1.5" fill={colors.graphicDarkRed} />
          <Rect x="10.5" y="8" width="3" height="13" fill={colors.white} />
          <Path
            d="M12 8c-2-3-5-2-4 0 1 1.5 3 1.2 4 1m0-1c2-3 5-2 4 0-1 1.5-3 1.2-4 1"
            fill={colors.graphicBrightRed}
            stroke={colors.graphicDarkRed}
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}
