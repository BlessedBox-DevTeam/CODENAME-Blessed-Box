import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import colors from '../../baseStyles/colors';

type GiftBoxIconProps = {
  size?: number;
  monochromeColor?: string;
};

export default function GiftBoxIcon({ size = 24, monochromeColor }: GiftBoxIconProps) {
  if (monochromeColor) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        accessibilityRole="image">
        <Rect
          x="4"
          y="10"
          width="16"
          height="11"
          rx="1.5"
          stroke={monochromeColor}
          strokeWidth="1.5"
        />
        <Rect
          x="3"
          y="7"
          width="18"
          height="4"
          rx="1"
          stroke={monochromeColor}
          strokeWidth="1.5"
        />
        <Path
          d="M12 7v14m0-14C9.8 3.5 5.2 4.1 6.4 6.4 7.3 8.1 9.5 8.1 12 7Zm0 0c2.2-3.5 6.8-2.9 5.6-.6-.9 1.7-3.1 1.7-5.6.6Z"
          stroke={monochromeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityRole="image">
      <Rect x="4" y="10" width="16" height="11" rx="1.5" fill={colors.brand.primary} />
      <Rect x="3" y="7" width="18" height="4" rx="1" fill={colors.accent.gold} />
      <Rect x="10.5" y="7" width="3" height="14" fill={colors.brand.dark} />
      <Path
        d="M12 7C9.8 3.5 5.2 4.1 6.4 6.4 7.3 8.1 9.5 8.1 12 7Zm0 0c2.2-3.5 6.8-2.9 5.6-.6-0.9 1.7-3.1 1.7-5.6.6Z"
        fill={colors.accent.gold}
        stroke={colors.status.warning}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <Rect x="3" y="9.5" width="18" height="1" fill={colors.status.warning} />
    </Svg>
  );
}
