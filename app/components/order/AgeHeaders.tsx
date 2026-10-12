import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../baseStyles/colors';
import { AGE_LABELS } from './orderTypes';

type AgeHeadersProps = {
  compact: boolean;
  gap: number;
};

export default function AgeHeaders({ compact, gap }: AgeHeadersProps) {
  return (
    <View style={[styles.row, { gap }, compact && styles.rowCompact]}>
      <View style={styles.labelColumn} />
      {AGE_LABELS.map((age) => (
        <View key={age} style={styles.heading}>
          <Text style={[styles.label, compact && styles.labelCompact]}>{age}</Text>
          <Text style={[styles.unit, compact && styles.unitCompact]}>yrs</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 22,
    marginBottom: 10,
  },
  rowCompact: {
    marginTop: 10,
    marginBottom: 5,
  },
  labelColumn: {
    flex: 1,
  },
  heading: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: colors.orderTextSubtle,
    fontSize: 14,
    fontWeight: '700',
  },
  labelCompact: {
    fontSize: 12,
  },
  unit: {
    color: colors.orderTextSubtleDark,
    fontSize: 11,
    marginTop: 2,
  },
  unitCompact: {
    fontSize: 9,
  },
});
