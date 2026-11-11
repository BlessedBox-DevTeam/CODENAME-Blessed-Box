import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../baseStyles/colors';
import CategoryIcon from './CategoryIcon';
import { GENDERS, Gender } from './orderTypes';
import GiftBoxIcon from '../icons/GiftBoxIcon';

type OrderSummaryCardProps = {
  total: number;
  totals: Record<Gender, number>;
  compact: boolean;
};

export default function OrderSummaryCard({ total, totals, compact }: OrderSummaryCardProps) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View>
        <Text style={[styles.caption, compact && styles.captionCompact]}>TOTAL BOXES</Text>
        <Text style={[styles.total, compact && styles.totalCompact]}>{total}</Text>
      </View>
      {total === 0 ? (
        <Text style={styles.empty}>No boxes yet</Text>
      ) : (
        <View style={styles.counts}>
          {GENDERS.filter(({ key }) => totals[key] > 0).map(({ key }) => (
            <View key={key} style={styles.count}>
              {key === 'unlabeled' ? (
                <GiftBoxIcon
                  size={compact ? 14 : 16}
                  monochromeColor={colors.order.actionText}
                />
              ) : (
                <CategoryIcon
                  gender={key}
                  color={colors.order.actionText}
                  size={compact ? 14 : 16}
                />
              )}
              <Text style={[styles.countText, compact && styles.countTextCompact]}>
                {totals[key]}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    borderRadius: 22,
    backgroundColor: colors.order.summary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCompact: {
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 18,
  },
  caption: {
    color: colors.order.summaryCaption,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  captionCompact: {
    fontSize: 12,
  },
  total: {
    color: colors.order.actionText,
    fontSize: 40,
    lineHeight: 45,
    fontWeight: '700',
    marginTop: 1,
  },
  totalCompact: {
    fontSize: 32,
    lineHeight: 37,
  },
  counts: {
    gap: 4,
    alignItems: 'flex-start',
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countText: {
    color: colors.order.actionText,
    fontSize: 16,
    fontWeight: '600',
  },
  countTextCompact: {
    fontSize: 14,
  },
  empty: {
    color: colors.order.summaryEmpty,
    fontSize: 14,
  },
});
