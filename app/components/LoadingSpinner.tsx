import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet } from 'react-native';

/**
 * LoadingOverlay component
 *
 * Displays a semi-transparent overlay with a spinning circular loader
 * when `visible` is set to true. The spinner fades in/out and rotates
 * continuously while visible.
 *
 * @component
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.visible=false] - Controls whether the overlay is visible.
 * If false, the component returns null.
 * @param {number} [props.size=90] - Size (width & height in pixels) of the spinner.
 * @param {string} [props.color="#d3d3d3"] - Color of the spinner border (excluding the transparent top section).
 *
 * @example
 * // Show a loading overlay while data is being fetched
 * <LoadingOverlay visible={isLoading} size={60} color="#4CAF50" />
 */
export default function LoadingOverlay({ visible = false, size = 90, color = '#d3d3d3' }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [rotate] = useState(() => new Animated.Value(0));
  const spinning = useRef<Animated.CompositeAnimation | null>(null);

  // Fade in/out and spin behavior
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (visible) {
      spinning.current = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinning.current.start();
    } else {
      rotate.stopAnimation();
      rotate.setValue(0);
    }

    return () => {
      rotate.stopAnimation();
    };
  }, [visible]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: size,
              height: size,
              borderColor: color,
              borderTopColor: 'transparent',
              transform: [{ rotate: spin }],
            },
          ]}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  spinner: {
    borderWidth: 7,
    borderRadius: 999,
  },
});
