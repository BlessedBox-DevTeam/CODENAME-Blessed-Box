import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingSpinner';
import TransactionTile from '../components/TransactionTile';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { response },
        } = await axios.get(`${API_URL}:${API_PORT}/api/transactions/recollectionCenterTransactions`, { params: { recollectionCenterId: 1 } });
        setTransactions(response);
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
        <ScrollView style={{ flex: 1, height: '100%', padding: 16 }} contentContainerStyle={{ gap: 10 }}>
          {transactions.map((transaction) => (
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
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
