import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../../baseStyles/colors';
import CategoryIcon from './CategoryIcon';
import AdjustmentButton from './AdjustmentButton';
import { AGE_LABELS, AgeIndex, GenderConfig } from './orderTypes';

type SelectedCategoryControllerProps = {
  config: GenderConfig | null;
  ageIndex: AgeIndex | null;
  value: number;
  compact: boolean;
  onAdjust: (amount: number) => void;
  onReset: () => void;
};

export default function SelectedCategoryController({
  config,
  ageIndex,
  value,
  compact,
  onAdjust,
  onReset,
}: SelectedCategoryControllerProps) {
  if (!config || ageIndex === null) {
    return (
      <View style={[styles.controller, styles.emptyController, compact && styles.controllerCompact]}>
        <Text style={styles.controllerHint}>Tap a cell to select a category</Text>
      </View>
    );
  }

  return (
    <View style={[styles.controller, compact && styles.controllerCompact]}>
      <View style={styles.heading}>
        <CategoryIcon gender={config.key} color={config.color} size={18} />
        <Text numberOfLines={1} style={[styles.title, { color: config.color }]}>
          {config.title} · {config.key === 'unlabeled' ? 'No age' : `${AGE_LABELS[ageIndex]} yrs`}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Reset ${config.title}, ${
            config.key === 'unlabeled' ? 'no age' : `${AGE_LABELS[ageIndex]} years`
          }`}
          accessibilityState={{ disabled: value === 0 }}
          disabled={value === 0}
          onPress={onReset}
          style={styles.resetButton}>
          <Feather
            name="rotate-ccw"
            size={12}
            color={value === 0 ? colors.orderTextResetDisabled : colors.orderTextReset}
          />
          <Text style={[styles.resetText, value === 0 && styles.resetTextDisabled]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <AdjustmentButton label="−" onPress={() => onAdjust(-1)} disabled={value === 0} />
        <Text style={styles.value}>{value}</Text>
        <AdjustmentButton label="+" onPress={() => onAdjust(1)} accent={config.buttonBackground} />
        {[5, 10, 20].map((amount) => (
          <AdjustmentButton
            key={amount}
            label={`+${amount}`}
            onPress={() => onAdjust(amount)}
            background={config.amountBackground}
            border={config.amountBorder}
            textColor={config.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controller: {
    minHeight: 90,
    borderRadius: 18,
    backgroundColor: colors.orderSurface,
    borderWidth: 1,
    borderColor: colors.orderBorder,
    padding: 11,
    justifyContent: 'space-between',
  },
  controllerCompact: {
    minHeight: 90,
    borderRadius: 16,
  },
  emptyController: {
    justifyContent: 'center',
  },
  controllerHint: {
    color: colors.orderTextHint,
    fontSize: 14,
    textAlign: 'center',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 22,
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  resetButton: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 3,
  },
  resetText: {
    color: colors.orderTextReset,
    fontSize: 11,
    fontWeight: '600',
  },
  resetTextDisabled: {
    color: colors.orderTextResetDisabled,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    width: 26,
    color: colors.orderText,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
});
