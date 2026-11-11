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
  const radius = 38;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const displayPercentage = Math.round(percentage);

  return (
    <View style={{ width: 76, height: 76, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height="76" width="76">
        <Circle
          stroke={colors.dashboard.goal.progressTrack}
          fill={colors.transparent}
          strokeWidth={strokeWidth}
          cx="38"
          cy="38"
          r={normalizedRadius}
        />
        <Circle
          stroke={colors.dashboard.goal.progress}
          fill={colors.transparent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          cx="38"
          cy="38"
          r={normalizedRadius}
          rotation="-90"
          origin="38, 38"
        />
      </Svg>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            commonStyles.header,
            {
              color: colors.dashboard.goal.text,
              fontSize: displayPercentage >= 100 ? 15 : 18,
              textAlign: 'center',
            },
          ]}>
          {`${displayPercentage}%`}
        </Text>
      </View>
    </View>
  );
};

export default CircularProgress;
