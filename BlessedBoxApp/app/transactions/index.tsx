import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Church from '../components/icons/Church';
import DepositHistory from '../components/icons/DepositHistory';
import Home from '../components/icons/Home';
import Newspaper from '../components/icons/NewsPaper';
import QRCode from '../components/icons/QRCode';
import TransactionTile from '../components/TransactionTile';
import axios from 'axios';
import Constants from 'expo-constants';
import LoadingOverlay from '../components/LoadingSpinner';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;

  const handleQrCodePress = () => {
    return router.push('./qrCode');
  };

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
              pressCallback={() =>
                router.push({
                  pathname: './depositDetails',
                  params: { transactionId: JSON.stringify(transaction.transactionId) },
                })
              }
              transaction={transaction}
            />
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingVertical: 8,
            backgroundColor: colors.white,
          }}>
          {/* Home */}
          <Pressable onPress={() => router.replace('./home')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Home width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Home</Text>
          </Pressable>

          {/* News */}
          <Pressable onPress={() => router.replace('./news')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Newspaper width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>News</Text>
          </Pressable>

          {/* QRCode */}
          <Pressable onPress={handleQrCodePress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <QRCode width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>QR</Text>
          </Pressable>

          {/* DepositHistory */}
          <Pressable onPress={() => router.replace('./transactions')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <DepositHistory width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>History</Text>
          </Pressable>

          {/* Centers */}
          <Pressable onPress={() => router.replace('./centers')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Church width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Centers</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
