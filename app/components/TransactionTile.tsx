import React, { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import {
  COMPLETED_STATUS_CODE,
  DECLINED_STATUS_CODE,
  PENDING_STATUS_CODE,
} from '../helpers/constants';
import { TransactionTileInfo } from '../types/TransactionTileInfo';
import GiftBoxIcon from './icons/GiftBoxIcon';

interface TransactionTileProps {
  transaction: TransactionTileInfo;
  pressCallback?: (transactionId: number) => void;
}

const MAP_STATUS_CODE_COLOR: Record<
  string,
  { variant: 'pending' | 'completed' | 'declined'; statusDescription: string }
> = {
  [PENDING_STATUS_CODE]: {
    variant: 'pending',
    statusDescription: 'Pending',
  },
  [COMPLETED_STATUS_CODE]: {
    variant: 'completed',
    statusDescription: 'Completed',
  },
  [DECLINED_STATUS_CODE]: {
    variant: 'declined',
    statusDescription: 'Declined',
  },
};

const TransactionTile = ({ transaction, pressCallback }: TransactionTileProps): JSX.Element => {
  const { transactionId, transactionNumber, statusCode, statusDescription, boxCount } = transaction;
  const status = MAP_STATUS_CODE_COLOR[String(statusCode).toUpperCase()] ?? {
    variant: 'declined' as const,
    statusDescription: statusDescription || 'Unknown',
  };
  const statusContainerStyle = styles[`${status.variant}StatusContainer`];
  const statusTextStyle = styles[`${status.variant}Status`];
  return (
    <Pressable
      onPress={() => {
        pressCallback?.(transactionId);
      }}
      style={styles.tileContainer}>
      <View style={styles.iconContainer}>
        <GiftBoxIcon size={24} />
      </View>
      <View style={styles.informationContainer}>
        <Text style={styles.orderNumber}>{transactionNumber}</Text>
        <View style={[styles.statusContainer, statusContainerStyle]}>
          <Text style={[styles.status, statusTextStyle]}>
            {statusDescription || status.statusDescription}
          </Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{boxCount}</Text>
        <Text style={styles.amountLabel}>boxes</Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  tileContainer: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 10,
    backgroundColor: colors.surface.card,
    borderWidth: 0.75,
    borderColor: colors.effects.greenBorder,
    // iOS
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Android
    elevation: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  informationContainer: {
    flex: 1,
    gap: 5,
  },
  orderNumber: {
    color: colors.text.primary,
    fontFamily: commonStyles.paragraphBold.fontFamily,
    fontSize: 12,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingStatusContainer: {
    backgroundColor: colors.status.pendingBackground,
  },
  completedStatusContainer: {
    backgroundColor: colors.status.completedBackground,
  },
  declinedStatusContainer: {
    backgroundColor: colors.status.declinedBackground,
  },
  status: {
    fontFamily: commonStyles.paragraphBold.fontFamily,
    fontSize: 10,
  },
  pendingStatus: {
    color: colors.status.pending,
  },
  completedStatus: {
    color: colors.brand.primary,
  },
  declinedStatus: {
    color: colors.status.danger,
  },
  amountContainer: {
    width: 45,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.transactions.tileAmountBackground,
  },
  amount: {
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 16,
    color: colors.dashboard.contribution.maleText,
  },
  amountLabel: {
    fontFamily: commonStyles.paragraph.fontFamily,
    fontSize: 8,
    color: colors.text.secondary,
  },
});

export default TransactionTile;
