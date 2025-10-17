import React, { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../baseStyles/colors';
import { CANCELLED_STATUS_ID, COMPLETED_STATUS_ID, PENDING_STATUS_ID } from '../helpers/constants';
import BlessedBox from './icons/BlessedBox';

interface Transaction {
  transactionId: number;
  recollectionCenterName: string;
  statusCode: number;
  statusDescription: string;
  boxCount: number;
}
interface TransactionTileProps {
  transaction: Transaction;
  pressCallback?: (transactionId: number) => void;
}

const MAP_STATUS_CODE_COLOR: Record<number, string> = {
  [PENDING_STATUS_ID]: colors.yellow,
  [COMPLETED_STATUS_ID]: colors.green_label,
  [CANCELLED_STATUS_ID]: colors.red_label,
};

const TransactionTile = ({ transaction, pressCallback }: TransactionTileProps): JSX.Element => {
  const { transactionId, recollectionCenterName, statusCode, statusDescription, boxCount } = transaction;
  return (
    <Pressable
      onPress={() => {
        pressCallback?.(transactionId);
      }}
      style={[styles.tileContainer]}>
      <BlessedBox width={40} height={70} />
      <View style={styles.informationContainer}>
        <Text style={[styles.recollectionCenterTitle, { textAlign: 'center' }]}>{recollectionCenterName}</Text>
        <View style={styles.orderContainer}>
          <Text style={styles.orderNumber}>{`#Order: ${transactionId}`}</Text>
          <View style={[styles.statusContainer, { backgroundColor: MAP_STATUS_CODE_COLOR[statusCode] }]}>
            <Text style={styles.status}>{statusDescription}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.amount}>{`x${boxCount}`}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  tileContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  informationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
  },
  recollectionCenterTitle: {
    color: colors.dark_blue,
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    fontStyle: 'normal',
  },
  orderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  orderNumber: {
    color: colors.dark_gray,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
  },
  statusContainer: {
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  status: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: colors.white,
    textTransform: 'uppercase',
  },
  amount: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: colors.dark_gray,
  },
});

export default TransactionTile;
