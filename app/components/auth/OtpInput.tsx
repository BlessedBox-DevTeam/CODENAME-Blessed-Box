import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { InteractionManager, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import commonStyles from '../../baseStyles/baseStyles';
import colors from '../../baseStyles/colors';

type OtpInputProps = {
  value: string;
  length?: number;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
};

export default function OtpInput({
  value,
  length = 6,
  onChangeText,
  autoFocus = false,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(focusInput);

      return () => task.cancel();
    }, [focusInput])
  );

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    onChangeText(cleaned);
  };

  const handlePress = () => {
    inputRef.current?.blur();
    requestAnimationFrame(focusInput);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        textAlign="center"
        caretHidden
        style={styles.hiddenInput}
      />

      <View style={styles.digitsRow}>
        {[...Array(length)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.digitCell,
              value[index] ? styles.digitCellFilled : null,
              index === value.length ? styles.digitCellActive : null,
            ]}>
            <Text style={styles.digitText}>{value[index] || ''}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 22,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.auth.input,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  digitsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  digitCell: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surface.card,
    borderWidth: 2,
    borderColor: colors.auth.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitCellFilled: {
    backgroundColor: colors.auth.benefits,
    borderColor: colors.auth.primary,
  },
  digitCellActive: {
    borderColor: colors.auth.primary,
  },
  digitText: {
    color: colors.auth.inputText,
    fontSize: 28,
    fontFamily: commonStyles.paragraphBold.fontFamily,
  },
});
