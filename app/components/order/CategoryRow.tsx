import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../../baseStyles/colors';
import CategoryIcon from './CategoryIcon';
import { AGE_LABELS, AgeIndex, BoxKey, BoxValues, GenderConfig } from './orderTypes';

type CategoryRowProps = {
  config: GenderConfig;
  values: BoxValues;
  selectedBox: BoxKey | null;
  cellHeight: number;
  gap: number;
  bottomMargin: number;
  onSelect: (key: BoxKey) => void;
};

export default function CategoryRow({
  config,
  values,
  selectedBox,
  cellHeight,
  gap,
  bottomMargin,
  onSelect,
}: CategoryRowProps) {
  const compact = cellHeight < 90;
  const ageIndices: AgeIndex[] = config.key === 'unlabeled' ? [0] : [0, 1, 2];

  return (
    <View style={[styles.row, { gap, marginBottom: bottomMargin }]}>
      <View
        accessibilityLabel={config.title}
        style={[
          styles.label,
          {
            height: cellHeight,
            borderColor: config.dimBorder,
            borderRadius: compact ? 15 : 20,
          },
        ]}>
        <CategoryIcon gender={config.key} color={config.color} size={compact ? 22 : 28} />
        <Text
          style={[
            styles.labelText,
            { color: config.color },
            compact && styles.labelTextCompact,
          ]}>
          {config.label}
        </Text>
      </View>
      {ageIndices.map((ageIndex) => {
        const key = `${config.key}-${ageIndex}` as BoxKey;
        const value = values[key];
        const selected = selectedBox === key;
        const noAge = config.key === 'unlabeled';

        return (
          <TouchableOpacity
            key={key}
            accessibilityRole="button"
            accessibilityLabel={
              noAge
                ? `${config.title}, no age, ${value} boxes`
                : `${config.title}, ${AGE_LABELS[ageIndex]} years, ${value} boxes`
            }
            accessibilityState={{ selected }}
            activeOpacity={0.75}
            onPress={() => onSelect(key)}
            style={[
              styles.cell,
              {
                height: cellHeight,
                borderRadius: compact ? 15 : 20,
                borderWidth: selected ? 2 : 1,
                flex: noAge ? 3 : 1,
                flexDirection: noAge ? 'row' : 'column',
                justifyContent: noAge ? 'space-between' : 'center',
                paddingHorizontal: noAge ? 16 : 0,
                borderColor: value === 0 && !selected ? config.dimBorder : config.border,
                backgroundColor: selected ? config.selectedBackground : colors.orderSurface,
                shadowColor: config.border,
                shadowOpacity: selected ? 0.45 : 0,
                elevation: selected ? 5 : 0,
              },
            ]}>
            {noAge ? (
              <>
                <View style={styles.noAgeCopy}>
                  <Text style={[styles.noAgeTitle, { color: config.color }]}>No age</Text>
                  {value === 0 && <Text style={styles.hint}>Tap to add</Text>}
                </View>
                <Text
                  style={[
                    styles.value,
                    styles.noAgeValue,
                    { color: config.color },
                    compact && styles.valueCompact,
                  ]}>
                  {value}
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.value,
                    { color: config.color },
                    compact && styles.valueCompact,
                  ]}>
                  {value}
                </Text>
                {value === 0 && <Text style={styles.hint}>tap to add</Text>}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: colors.orderSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  labelTextCompact: {
    fontSize: 9,
    marginTop: 2,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  value: {
    fontSize: 38,
    fontWeight: '600',
  },
  valueCompact: {
    fontSize: 29,
  },
  hint: {
    color: colors.orderTextMuted,
    fontSize: 9,
    marginTop: -2,
  },
  noAgeCopy: {
    alignItems: 'flex-start',
  },
  noAgeTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  noAgeValue: {
    fontWeight: '700',
  },
});
