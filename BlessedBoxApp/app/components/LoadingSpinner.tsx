import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function LoadingOverlay({ visible = false, size = 50, color = '#000' }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const spinning = useRef(null);

  // Fade in/out effect
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (visible) {
      // Start rotating loop
      spinning.current = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinning.current.start();
    } else {
      // Stop and reset rotation
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  spinner: {
    borderWidth: 4,
    borderRadius: 999,
  },
});
