import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing, Keyboard } from 'react-native';
import colors from '../baseStyles/colors';

interface SliderProps {
  /**
   * Callback fired when the value changes.
   * @param value - 0 (left/off) or 1 (right/on).
   */
  onValueChange?: (value: number) => void;
}

const THUMB_SIZE = 24;

/**
 * `Slider` is a custom toggle-like component that switches between two states (0 or 1).
 *
 * - Displays a thumb that slides left or right with animation.
 * - The background color changes depending on the selected value.
 * - Exposes a `reset()` method via `ref` to reset the value back to `0`.
 *
 * @component
 * @example
 * ```tsx
 * const sliderRef = useRef<any>(null);
 *
 * return (
 *   <Slider
 *     ref={sliderRef}
 *     onValueChange={(val) => console.log("New value:", val)}
 *   />
 * );
 *
 * // Parent can reset the slider:
 * sliderRef.current?.reset();
 * ```
 */
const Slider = forwardRef<any, SliderProps>(({ onValueChange }, ref) => {
  const [selected, setSelected] = useState(0);
  const thumbAnim = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  // Animate thumb when `selected` changes
  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: selected,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [selected, thumbAnim]);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    /** Resets the slider back to 0. */
    reset: () => setSelected(0),
  }));

  const backgroundColor = selected === 0 ? colors.dark_red : colors.darker_green;

  /** Toggle between 0 and 1, updating state and firing callback. */
  const handleToggle = () => {
    Keyboard.dismiss();
    const newValue = selected === 0 ? 1 : 0;
    setSelected(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  // Dynamically calculate thumb position based on track width
  const thumbPosition = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(trackWidth - THUMB_SIZE, 0)],
  });

  return (
    <Pressable style={[styles.container, { backgroundColor }]} onPress={handleToggle}>
      <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.thumb, { left: thumbPosition }]} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 25,
  },
  track: {
    width: '98%',
    height: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    position: 'absolute',
    top: -2,
    backgroundColor: colors.white,
  },
});

export default Slider;
