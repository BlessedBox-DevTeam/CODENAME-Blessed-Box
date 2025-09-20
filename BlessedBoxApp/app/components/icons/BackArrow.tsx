import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import colors from '@/app/baseStyles/colors';

interface BackArrowProps {
  width?: number;
  height?: number;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // <-- añadimos style
}

export default function BackArrow({
  width = 25,
  height = 25,
  color = colors.dark_blue,
  onPress,
  style, // <-- recibimos style
}: BackArrowProps) {
  return (
    <Pressable onPress={onPress} style={[{ justifyContent: 'center' }, style]} hitSlop={10}>
      <Svg width={width} height={height} viewBox="0 0 41 26" fill="none">
        <G clipPath="url(#clip0)">
          <Path
            d="M38.2719 11.2501H5.91187L13.6349 3.43909C13.9603 3.10903 14.1427 2.66413 14.1427 2.2006C14.1427 1.73707 13.9603 1.29217 13.6349 0.962097C13.4751 0.799673 13.2846 0.67068 13.0745 0.582626C12.8643 0.494573 12.6387 0.449219 12.4109 0.449219C12.183 0.449219 11.9575 0.494573 11.7473 0.582626C11.5372 0.67068 11.3467 0.799673 11.1869 0.962097L0.507812 11.7621C0.182433 12.092 0 12.5367 0 13.0001C0 13.4635 0.182433 13.9082 0.507812 14.2381L11.1869 25.0381C11.3467 25.2005 11.5372 25.3295 11.7473 25.4176C11.9575 25.5056 12.183 25.551 12.4109 25.551C12.6387 25.551 12.8643 25.5056 13.0745 25.4176C13.2846 25.3295 13.4751 25.2005 13.6349 25.0381C13.9603 24.7082 14.1427 24.2635 14.1427 23.8001C14.1427 23.3367 13.9603 22.892 13.6349 22.5621L5.91187 14.7501H38.2719C38.7257 14.7348 39.1559 14.5437 39.4716 14.2171C39.7872 13.8906 39.9637 13.4542 39.9637 13.0001C39.9637 12.5459 39.7872 12.1096 39.4716 11.7831C39.1559 11.4565 38.7257 11.2654 38.2719 11.2501Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0">
            <Rect width="40.018" height="25.1018" fill="white" transform="translate(0 0.449219)" />
          </ClipPath>
        </Defs>
      </Svg>
    </Pressable>
  );
}
