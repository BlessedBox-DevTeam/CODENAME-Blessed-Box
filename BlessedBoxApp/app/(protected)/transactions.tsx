import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SectionList, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import LoadingOverlay from '../components/LoadingSpinner';
import TransactionTile from '../components/TransactionTile';
import { formatTransactionDate, groupByDate, sortByDateProp } from '../helpers/helpers';
import { TransactionTileInfo } from '../types/TransactionTileInfo';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;
  const todayStr = new Date().toDateString();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const {
        data: { response },
      } = await axios.get(`${API_URL}:${API_PORT}/api/transactions/recollectionCenterTransactions`, { params: { recollectionCenterId: 1, page } });
      setTotalCount(response.totalCount);
      const updatedTransactions = [...allTransactions, ...response.transactions];
      setAllTransactions(updatedTransactions);
      const sortedTransactions = sortByDateProp(updatedTransactions, 'createdDate');
      const grouped: Record<string, TransactionTileInfo[]> = groupByDate(sortedTransactions, 'createdDate');
      const newSections: { title: string; data: TransactionTileInfo[] }[] = Object.entries(grouped).map(([dateKey, items]) => ({
        title: dateKey === todayStr ? 'Today' : formatTransactionDate(dateKey, false),
        data: items,
      }));
      setSections(newSections);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.transactionId.toString()}
          renderItem={({ item }) => (
            <TransactionTile
              transaction={item}
              pressCallback={(transactionId) => {
                router.push({
                  pathname: '/depositDetails/depositDetails',
                  params: { transactionId: JSON.stringify(transactionId) },
                });
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>{title}</Text>}
          onEndReached={() => {
            const totalLoaded = allTransactions.length;
            const hasMore = totalLoaded < totalCount;
            if (hasMore && !isLoading) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ gap: 16, padding: 18 }}></SectionList>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
