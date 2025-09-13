import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

/**
 * Props for the CircularProgress component.
 */
interface CircularProgressProps {
  /**
   * Progress percentage to display (0–100).
   */
  percentage: number;
}

/**
 * Circular progress indicator component.
 *
 * Renders a circular progress bar with a percentage
 * value displayed at the center.
 *
 * @component
 * @example
 * ```tsx
 * <CircularProgress percentage={75} />
 * ```
 *
 * @param {CircularProgressProps} props - The component props.
 * @param {number} props.percentage - Progress percentage (0–100).
 * @returns {JSX.Element} React component.
 */
const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  /** Radius of the circle */
  const radius = 50;

  /** Width of the circle stroke */
  const strokeWidth = 10;

  /** Normalized radius to keep stroke inside the circle */
  const normalizedRadius = radius - strokeWidth / 2;

  /** Circumference of the circle (used for dasharray) */
  const circumference = 2 * Math.PI * normalizedRadius;

  /** Offset of the stroke to represent the percentage filled */
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={commonStyles.container}>
      <Svg height="100" width="100">
        {/* Gray background circle */}
        <Circle
          stroke={colors.light_gray}
          fill="transparent"
          strokeWidth={strokeWidth}
          cx="50"
          cy="50"
          r={normalizedRadius}
        />
        {/* Progress circle */}
        <Circle
          stroke={colors.dark_green}
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

      {/* Center text */}
      <View style={commonStyles.textContainer}>
        <Text style={commonStyles.header}>{`${percentage}%`}</Text>
      </View>
    </View>
  );
};

export default CircularProgress;
