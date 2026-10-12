import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../../baseStyles/colors';

type AdjustmentButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accent?: string;
  background?: string;
  border?: string;
  textColor?: string;
};

export default function AdjustmentButton({
  label,
  onPress,
  disabled = false,
  accent,
  background,
  border,
  textColor,
}: AdjustmentButtonProps) {
  const isPlus = label === '+';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label === '−' ? 'Decrease by one' : label === '+' ? 'Increase by one' : label}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        isPlus
          ? { backgroundColor: accent, borderColor: accent }
          : label === '−'
            ? styles.minusButton
            : { backgroundColor: background, borderColor: border },
        disabled && label !== '−' && styles.disabled,
      ]}>
      {isPlus ? (
        <Feather name="plus" size={17} color={colors.orderText} />
      ) : label === '−' ? (
        <Feather name="minus" size={17} color={colors.orderTextReset} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.orderUnlabeledAmount,
    borderWidth: 1,
    borderColor: colors.orderUnlabeledAmountBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButton: {
    backgroundColor: colors.orderMinusBackground,
    borderColor: colors.orderMinusBackground,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
});
