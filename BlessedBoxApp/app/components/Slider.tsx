import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import colors from '../baseStyles/colors';

interface SliderProps {
  onValueChange?: (value: number) => void;
}

const THUMB_SIZE = 24;

const Slider = forwardRef<any, SliderProps>(({ onValueChange }, ref) => {
  const [selected, setSelected] = useState(0);
  const thumbAnim = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: selected,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [selected, thumbAnim]);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    reset: () => setSelected(0),
  }));

  const backgroundColor =
    selected === 0 ? colors.dark_red : colors.darker_green;

  const handleToggle = () => {
    const newValue = selected === 0 ? 1 : 0;
    setSelected(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  // Calculate thumb position dynamically
  const thumbPosition = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(trackWidth - THUMB_SIZE, 0)],
  });

  return (
    <Pressable
      style={[styles.container, { backgroundColor }]}
      onPress={handleToggle}>
      <View
        style={styles.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
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
