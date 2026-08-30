import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    onChangeText(cleaned);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.container}>
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
    backgroundColor: '#F0E5DD',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitCellFilled: {
    borderColor: '#D8C2B1',
  },
  digitCellActive: {
    borderColor: '#D95727',
  },
  digitText: {
    color: '#2B211C',
    fontSize: 28,
    fontWeight: '700',
  },
});
