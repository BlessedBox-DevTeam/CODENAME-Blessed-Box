import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingSpinner';
import TransactionTile from '../components/TransactionTile';
import { formatTransactionDate, groupByDate, sortByDateProp } from '../helpers/helpers';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import { TransactionTileInfo } from '../types/TransactionTileInfo';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState({});
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;
  const todayStr = new Date().toDateString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { response },
        } = await axios.get(`${API_URL}:${API_PORT}/api/transactions/recollectionCenterTransactions`, { params: { recollectionCenterId: 1 } });
        const sortedTransactions = sortByDateProp(response, 'createdDate');
        const grouped = groupByDate(sortedTransactions, 'createdDate');
        setTransactions(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, height: '100%', padding: 16 }} contentContainerStyle={{ gap: 16 }}>
          {Object.entries(transactions).map(([dateKey, items]) => (
            <View
              key={dateKey}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                justifyContent: 'center',
              }}>
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>{dateKey === todayStr ? 'Today' : formatTransactionDate(dateKey, false)}</Text>
              {items.map((transaction: TransactionTileInfo) => (
                <TransactionTile
                  key={transaction.transactionId}
                  pressCallback={(transactionId) => {
                    router.push({
                      pathname: '/depositDetails/depositDetails',
                      params: { transactionId: JSON.stringify(transactionId) },
                    });
                  }}
                  transaction={transaction}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
