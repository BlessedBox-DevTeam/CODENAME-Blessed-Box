import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../baseStyles/colors';
import {
  BOX_AGE_MAP,
  FEMALE_GENDER_ID,
  MALE_GENDER_ID,
  UNLABELED_GENDER_ID,
} from '../../helpers/constants';
import { formatTransactionDate } from '../../helpers/helpers';

type TransactionDetails = {
  transactionId: number;
  statusCode: number;
  name: string;
  lastName: string;
  secondLastName: string;
  email: string;
  transactionDate: string;
  recollectionCenterName: string;
};

type BoxSummary = {
  age: string | number | false;
  genderId: number;
  quantity: number;
};

interface DepositHeaderProps {
  transaction: TransactionDetails;
  totalBoxes: number;
  boys: number;
  girls: number;
  statusLabel: string;
  statusColor: string;
  onBack: () => void;
}

export function DepositHeader({
  transaction,
  totalBoxes,
  boys,
  girls,
  statusLabel,
  statusColor,
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
          <Text style={styles.logoMark}>{'✚'}</Text>
        </View>
        <View style={styles.orderIdentity}>
          <Text style={styles.orderLabel}>Order #</Text>
          <Text style={styles.orderNumber}>
            BBX-{String(transaction.transactionId).padStart(8, '0')}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: colors.white }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat value={totalBoxes} label="Total boxes" />
        <Stat value={boys} label="Boys" />
        <Stat value={girls} label="Girls" />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
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
  const fullName =
    `${transaction.name} ${transaction.lastName} ${transaction.secondLastName}`.trim();
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
      value: `BBX-${String(transaction.transactionId).padStart(8, '0')}`,
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
  const ages = Array.from(new Set(boxes.map((box) => String(box.age))));
  const rows = ages.map((age) => {
    const ageBoxes = boxes.filter((box) => String(box.age) === age);
    const boys = getQuantity(ageBoxes, MALE_GENDER_ID);
    const girls = getQuantity(ageBoxes, FEMALE_GENDER_ID);
    const unlabeled = getQuantity(ageBoxes, UNLABELED_GENDER_ID);
    return { age, boys, girls, unlabeled, total: boys + girls + unlabeled };
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
        <View key={row.age} style={styles.summaryRow}>
          <Text style={[styles.summaryValue, styles.ageColumn]}>{formatAge(row.age)}</Text>
          <Count value={row.boys} color={colors.dark_blue} />
          <Count value={row.girls} color={colors.red_label} />
          <Text style={styles.summaryValue}>{row.unlabeled}</Text>
          <Text style={styles.summaryValue}>{row.total}</Text>
        </View>
      ))}
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={[styles.summaryValue, styles.ageColumn]}>Total</Text>
        <Text style={[styles.summaryValue, styles.boysHeader]}>{totals.boys}</Text>
        <Text style={[styles.summaryValue, styles.girlsHeader]}>{totals.girls}</Text>
        <Text style={styles.summaryValue}>{totals.unlabeled}</Text>
        <Text style={styles.summaryValue}>{totals.total}</Text>
      </View>
    </View>
  );
}

function Count({ value, color }: { value: number; color: string }) {
  return (
    <View
      style={[
        styles.countBadge,
        { backgroundColor: color === colors.red_label ? '#FDE9E9' : '#E8EEF9' },
      ]}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  );
}

function getQuantity(boxes: BoxSummary[], genderId: number) {
  return boxes
    .filter((box) => box.genderId === genderId)
    .reduce((sum, box) => sum + box.quantity, 0);
}

function formatAge(age: string) {
  if (age === 'false') return 'Unlabeled';
  const ageLabel = BOX_AGE_MAP[Number(age)] ?? age;
  return ageLabel.includes('-') ? `${ageLabel} yrs` : ageLabel;
}

const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: colors.dark_blue,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 76 },
  backArrow: { color: colors.white, fontSize: 26, lineHeight: 20, marginRight: 4 },
  backText: { color: colors.white, fontFamily: 'OpenSans-SemiBold', fontSize: 12 },
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
  summaryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  summaryHeaderText: { color: '#58719B', fontFamily: 'OpenSans-SemiBold', fontSize: 10 },
  ageColumn: { flex: 1.4, textAlign: 'left' },
  boysHeader: {
    flex: 0.8,
    textAlign: 'center',
    color: colors.dark_blue,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 10,
  },
  girlsHeader: {
    flex: 0.8,
    textAlign: 'center',
    color: colors.red_label,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 10,
  },
  totalHeader: {
    flex: 0.9,
    textAlign: 'center',
    color: '#58719B',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 10,
  },
  summaryRow: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#D4DCE9',
    borderRadius: 14,
    backgroundColor: '#F5F6F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  summaryValue: {
    flex: 0.8,
    textAlign: 'center',
    color: '#101A2D',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
  },
  countBadge: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 3,
  },
  totalRow: { backgroundColor: '#E8EEF9', borderColor: '#C7D4EC' },
});
