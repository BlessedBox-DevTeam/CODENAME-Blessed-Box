import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../baseStyles/colors';
import {
  COMPLETED_STATUS_CODE,
  DECLINED_STATUS_CODE,
  PENDING_STATUS_CODE,
} from '../helpers/constants';
import { TransactionTileInfo } from '../types/TransactionTileInfo';

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
  const { transactionId, statusCode, statusDescription, boxCount } = transaction;
  const status = MAP_STATUS_CODE_COLOR[String(statusCode).toUpperCase()] ?? {
    variant: 'declined' as const,
    statusDescription: statusDescription || 'Unknown',
  };
  const statusContainerStyle = styles[`${status.variant}StatusContainer`];
  const statusTextStyle = styles[`${status.variant}Status`];
  const orderNumber = `BBX-${new Date().getFullYear()}-${String(transactionId).padStart(6, '0')}`;

  return (
    <Pressable
      onPress={() => {
        pressCallback?.(transactionId);
      }}
      style={styles.tileContainer}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="gift" size={24} color={styles.transactionIcon.color} />
      </View>
      <View style={styles.informationContainer}>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
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
    backgroundColor: colors.white,
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#E9EEF9',
    overflow: 'hidden',
  },
  transactionIcon: {
    color: colors.dark_green,
  },
  informationContainer: {
    flex: 1,
    gap: 5,
  },
  orderNumber: {
    color: colors.dark_blue,
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingStatusContainer: {
    backgroundColor: '#FFF4D7',
  },
  completedStatusContainer: {
    backgroundColor: '#E2F4E6',
  },
  declinedStatusContainer: {
    backgroundColor: '#FBE3E3',
  },
  status: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
  },
  pendingStatus: {
    color: '#F08A00',
  },
  completedStatus: {
    color: colors.green_label,
  },
  declinedStatus: {
    color: colors.red_label,
  },
  amountContainer: {
    width: 45,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#E9EEF9',
  },
  amount: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: colors.dark_blue,
  },
  amountLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 8,
    color: colors.dark_gray,
  },
});

export default TransactionTile;
