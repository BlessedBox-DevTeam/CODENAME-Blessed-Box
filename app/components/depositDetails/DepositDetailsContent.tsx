import React, { ReactNode } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../baseStyles/colors';
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
  statusBackgroundColor: string;
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
  statusBackgroundColor,
  onBack,
}: DepositHeaderProps) {
  return (
    <View style={styles.headerArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityRole="button">
          <Text style={styles.backArrow}>{'‹'}</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Detail</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.orderRow}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="gift" size={25} color={colors.dark_green} />
        </View>
        <View style={styles.orderIdentity}>
          <Text style={styles.orderLabel}>Order #</Text>
          <Text style={styles.orderNumber}>{transaction.transactionNumber}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusBackgroundColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat value={totalBoxes} label="Total boxes" />
        <Stat value={boys} label="Boys" />
        <Stat value={girls} label="Girls" />
        <Stat value={unlabeled} label="Unlabeled" isLast />
      </View>
    </View>
  );
}

function Stat({
  value,
  label,
  isLast = false,
}: {
  value: number;
  label: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.stat, isLast && styles.lastStat]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
      label: 'Order #',
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
          <Count value={row.boys} color={colors.dark_blue} />
          <Count value={row.girls} color={colors.red_label} />
          <Text style={[styles.summaryValue, styles.summaryCell]}>{row.unlabeled}</Text>
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
        <Text style={[styles.summaryValue, styles.summaryCell]}>{totals.unlabeled}</Text>
        <Text style={[styles.summaryValue, styles.summaryCell]}>{totals.total}</Text>
      </View>
    </View>
  );
}

function Count({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.countCell}>
      <View
        style={[
          styles.countBadge,
          { backgroundColor: color === colors.red_label ? '#FDE9E9' : '#E8EEF9' },
        ]}>
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
    backgroundColor: colors.dark_blue,
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
  backButton: { flexDirection: 'row', alignItems: 'center', width: 76 },
  backArrow: { color: colors.white, fontSize: 24, lineHeight: 24, marginRight: 4 },
  backText: {
    color: colors.white,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  headerTitle: { color: colors.white, fontFamily: 'OpenSans-Bold', fontSize: 14 },
  headerSpacer: { width: 76 },
  orderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#304775',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: { color: colors.dark_green, fontSize: 26, fontFamily: 'OpenSans-Bold' },
  orderIdentity: { marginLeft: 10, flex: 1 },
  orderLabel: { color: '#B5C1DC', fontFamily: 'OpenSans-SemiBold', fontSize: 10 },
  orderNumber: { color: colors.white, fontFamily: 'OpenSans-Bold', fontSize: 14 },
  statusPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  statusText: { fontFamily: 'OpenSans-Bold', fontSize: 10 },
  statsRow: { flexDirection: 'row', backgroundColor: '#304775', borderRadius: 14, minHeight: 64 },
  stat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#60739B',
    borderRightWidth: 1,
  },
  lastStat: { borderRightWidth: 0 },
  statValue: { color: colors.white, fontFamily: 'OpenSans-Bold', fontSize: 20 },
  statLabel: { color: '#B5C1DC', fontFamily: 'OpenSans-SemiBold', fontSize: 10 },
  infoList: { gap: 10 },
  infoRow: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#D4DCE9',
    borderRadius: 14,
    backgroundColor: '#F5F6F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 10 },
  infoLabel: { color: '#58719B', fontFamily: 'OpenSans-SemiBold', fontSize: 10 },
  infoValue: { color: '#101A2D', fontFamily: 'OpenSans-SemiBold', fontSize: 12 },
  summaryTable: { gap: 10 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  summaryHeaderText: { color: '#58719B', fontFamily: 'OpenSans-SemiBold', fontSize: 9 },
  ageColumn: { flex: 1.15, textAlign: 'left' },
  boysHeader: {
    flex: 0.72,
    textAlign: 'center',
    color: colors.dark_blue,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 9,
  },
  girlsHeader: {
    flex: 0.72,
    textAlign: 'center',
    color: colors.red_label,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 9,
  },
  totalHeader: {
    flex: 0.95,
    textAlign: 'center',
    color: '#58719B',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 9,
  },
  summaryRow: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#D4DCE9',
    borderRadius: 14,
    backgroundColor: '#F5F6F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryValue: {
    textAlign: 'center',
    color: '#101A2D',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 11,
  },
  summaryCell: { flex: 0.72 },
  totalBoysValue: { color: colors.dark_blue },
  totalGirlsValue: { color: colors.red_label },
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
  totalRow: { backgroundColor: '#E8EEF9', borderColor: '#C7D4EC' },
});
