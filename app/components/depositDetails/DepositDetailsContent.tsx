import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import commonStyles from '../../baseStyles/baseStyles';
import colors from '../../baseStyles/colors';
import BackArrow from '../icons/BackArrow';
import GiftBoxIcon from '../icons/GiftBoxIcon';
import {
  FEMALE_GENDER_CODE,
  GenderCode,
  MALE_GENDER_CODE,
  UNLABELED_GENDER_CODE,
} from '../../helpers/constants';
import { formatTransactionDate } from '../../helpers/helpers';

type TransactionDetails = {
  transactionId: number;
  statusCode: string;
  statusId: number;
  firstName: string;
  lastName: string;
  email: string;
  transactionDate: string;
  recollectionCenterName: string;
  transactionNumber: string;
};

type BoxSummary = { ageCode: string; genderCode: GenderCode; quantity: number };

interface DepositHeaderProps {
  transaction: TransactionDetails;
  totalBoxes: number;
  boys: number;
  girls: number;
  unlabeled: number;
  statusLabel: string;
  statusColor: string;
  onBack: () => void;
}

export function DepositHeader({
  transaction,
  totalBoxes,
  boys,
  girls,
  unlabeled,
  statusLabel,
  statusColor,
  onBack,
}: DepositHeaderProps) {
  return (
    <View style={styles.headerArea}>
      <View style={styles.headerRow}>
        <BackArrow onPress={onBack} color={colors.text.primary} />
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Drop-off Details</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.orderRow}>
        <View style={styles.logoCircle}>
          <GiftBoxIcon size={25} />
        </View>
        <View style={styles.orderIdentity}>
          <Text style={styles.orderLabel}>Drop-off #</Text>
          <Text style={styles.orderNumber}>{transaction.transactionNumber}</Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat
          value={totalBoxes}
          label="Total boxes"
          color={colors.text.primary}
          backgroundColor={colors.surface.total}
        />
        <Stat
          value={boys}
          label="Boys"
          color={colors.dashboard.contribution.maleText}
          backgroundColor={colors.dashboard.contribution.maleBackground}
        />
        <Stat
          value={girls}
          label="Girls"
          color={colors.dashboard.contribution.femaleText}
          backgroundColor={colors.dashboard.contribution.femaleBackground}
        />
        <Stat
          value={unlabeled}
          label="Unlabeled"
          color={colors.dashboard.contribution.unlabeledText}
          backgroundColor={colors.dashboard.contribution.unlabeledBackground}
          isLast
        />
      </View>
    </View>
  );
}

function Stat({
  value,
  label,
  color,
  backgroundColor = colors.surface.card,
  isLast = false,
}: {
  value: number;
  label: string;
  color: string;
  backgroundColor?: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.stat, { backgroundColor }, isLast && styles.lastStat]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
    </View>
  );
}

interface DepositInfoProps {
  transaction: TransactionDetails;
  icons: {
    contact: ReactNode;
    email: ReactNode;
    date: ReactNode;
    order: ReactNode;
    church: ReactNode;
  };
}

export function DepositInfo({ transaction, icons }: DepositInfoProps) {
  const fullName = `${transaction.firstName} ${transaction.lastName}`.trim();
  const rows = [
    { label: 'Contact', value: fullName, icon: icons.contact },
    { label: 'Email', value: transaction.email, icon: icons.email },
    {
      label: 'Date',
      value: formatTransactionDate(transaction.transactionDate).toLocaleString(),
      icon: icons.date,
    },
    {
      label: 'Drop-off #',
      value: transaction.transactionNumber,
      icon: icons.order,
    },
    { label: 'Church', value: transaction.recollectionCenterName, icon: icons.church },
  ];

  return (
    <View style={styles.infoList}>
      {rows.map((row) => (
        <View key={row.label} style={styles.infoRow}>
          <View style={styles.infoIcon}>{row.icon}</View>
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function BoxSummaryTable({ boxes }: { boxes: BoxSummary[] }) {
  const ages = Array.from(new Set(boxes.map((box) => box.ageCode)));
  const rows = ages.map((ageCode) => {
    const ageBoxes = boxes.filter((box) => box.ageCode === ageCode);
    const boys = getQuantity(ageBoxes, MALE_GENDER_CODE);
    const girls = getQuantity(ageBoxes, FEMALE_GENDER_CODE);
    const unlabeled = getQuantity(ageBoxes, UNLABELED_GENDER_CODE);
    return { ageCode, boys, girls, unlabeled, total: boys + girls + unlabeled };
  });
  const totals = rows.reduce(
    (result, row) => ({
      boys: result.boys + row.boys,
      girls: result.girls + row.girls,
      unlabeled: result.unlabeled + row.unlabeled,
      total: result.total + row.total,
    }),
    { boys: 0, girls: 0, unlabeled: 0, total: 0 }
  );

  return (
    <View style={styles.summaryTable}>
      <View style={styles.summaryHeader}>
        <Text style={[styles.summaryHeaderText, styles.ageColumn]}>Age</Text>
        <Text style={styles.boysHeader}>Boys</Text>
        <Text style={styles.girlsHeader}>Girls</Text>
        <Text style={styles.totalHeader}>Unlabeled</Text>
        <Text style={styles.totalHeader}>Total</Text>
      </View>
      {rows.map((row) => (
        <View key={row.ageCode} style={styles.summaryRow}>
          <Text style={[styles.summaryValue, styles.summaryCell, styles.ageColumn]}>
            {formatAge(row.ageCode)}
          </Text>
          <Count
            value={row.boys}
            color={colors.dashboard.contribution.maleText}
            backgroundColor={colors.dashboard.contribution.maleBackground}
          />
          <Count
            value={row.girls}
            color={colors.dashboard.contribution.femaleText}
            backgroundColor={colors.dashboard.contribution.femaleBackground}
          />
          <Count
            value={row.unlabeled}
            color={colors.dashboard.contribution.unlabeledText}
            backgroundColor={colors.dashboard.contribution.unlabeledBackground}
          />
          <Text style={[styles.summaryValue, styles.summaryCell]}>{row.total}</Text>
        </View>
      ))}
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={[styles.summaryValue, styles.summaryCell, styles.ageColumn]}>Total</Text>
        <Text style={[styles.summaryValue, styles.summaryCell, styles.totalBoysValue]}>
          {totals.boys}
        </Text>
        <Text style={[styles.summaryValue, styles.summaryCell, styles.totalGirlsValue]}>
          {totals.girls}
        </Text>
        <Text style={[styles.summaryValue, styles.summaryCell, styles.totalUnlabeledValue]}>
          {totals.unlabeled}
        </Text>
        <Text style={[styles.summaryValue, styles.summaryCell]}>{totals.total}</Text>
      </View>
    </View>
  );
}

function Count({
  value,
  color,
  backgroundColor,
}: {
  value: number;
  color: string;
  backgroundColor: string;
}) {
  return (
    <View style={styles.countCell}>
      <View style={[styles.countBadge, { backgroundColor }]}>
        <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

function getQuantity(boxes: BoxSummary[], genderCode: GenderCode) {
  return boxes
    .filter((box) => box.genderCode === genderCode)
    .reduce((sum, box) => sum + box.quantity, 0);
}

function formatAge(age: string) {
  if (age === 'UNLABELED') return 'Unlabeled';
  return `${age} yrs`;
}

const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: colors.auth.header,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    color: colors.text.primary,
    fontFamily: commonStyles.paragraphBold.fontFamily,
    fontSize: 14,
  },
  headerSpacer: { width: 44 },
  orderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    color: colors.text.inverse,
    fontSize: 26,
    fontFamily: commonStyles.paragraphBold.fontFamily,
  },
  orderIdentity: { marginLeft: 10, flex: 1 },
  orderLabel: {
    color: colors.text.secondary,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 10,
  },
  orderNumber: {
    color: colors.text.primary,
    fontFamily: commonStyles.paragraphBold.fontFamily,
    fontSize: 14,
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface.card,
  },
  statusText: { fontFamily: commonStyles.paragraphBold.fontFamily, fontSize: 10 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
    borderRadius: 14,
    minHeight: 64,
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: colors.surface.card,
    borderRightWidth: 2,
  },
  lastStat: { borderRightWidth: 0 },
  statValue: { fontFamily: commonStyles.paragraphBold.fontFamily, fontSize: 20 },
  statLabel: {
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 10,
  },
  infoList: { gap: 10 },
  infoRow: {
    minHeight: 56,
    borderWidth: 0.75,
    borderColor: colors.effects.greenBorder,
    borderRadius: 14,
    backgroundColor: colors.surface.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.deposit.paleBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 10 },
  infoLabel: {
    color: colors.deposit.mutedBlue,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 10,
  },
  infoValue: {
    color: colors.deposit.darkText,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 12,
  },
  summaryTable: { gap: 10 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  summaryHeaderText: {
    color: colors.deposit.mutedBlue,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 9,
  },
  ageColumn: { flex: 1.15, textAlign: 'left' },
  boysHeader: {
    flex: 0.72,
    textAlign: 'center',
    color: colors.brand.dark,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 9,
  },
  girlsHeader: {
    flex: 0.72,
    textAlign: 'center',
    color: colors.status.danger,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 9,
  },
  totalHeader: {
    flex: 0.95,
    textAlign: 'center',
    color: colors.deposit.mutedBlue,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 9,
  },
  summaryRow: {
    minHeight: 42,
    borderWidth: 0.75,
    borderColor: colors.effects.greenBorder,
    borderRadius: 14,
    backgroundColor: colors.surface.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryValue: {
    textAlign: 'center',
    color: colors.deposit.darkText,
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 11,
  },
  summaryCell: { flex: 0.72 },
  totalBoysValue: { color: colors.brand.dark },
  totalGirlsValue: { color: colors.status.danger },
  totalUnlabeledValue: { color: colors.dashboard.contribution.unlabeledText },
  countCell: {
    flex: 0.72,
    alignItems: 'center',
  },
  countBadge: {
    minWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  totalRow: {
    backgroundColor: colors.surface.total,
    borderColor: colors.effects.greenBorder,
  },
});
