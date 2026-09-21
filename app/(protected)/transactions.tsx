import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import CalendarIcon from '../components/icons/CalendarIcon';
import Filter from '../components/icons/Filter';
import LoadingOverlay from '../components/LoadingSpinner';
import TransactionTile from '../components/TransactionTile';
import TransactionFiltersModal, {
  StatusCode,
  StatusFilter,
} from '../components/TransactionFiltersModal';
import {
  SOCKET_EVENT_NEW_TRANSACTION,
  SOCKET_EVENT_TRANSACTION_UPDATED,
} from '../helpers/constants';
import { formatTransactionDate, groupByDate, sortByDateProp } from '../helpers/helpers';
import { getRecollectionCenterTransactions } from '../services/services';
import { getSocket } from '../socketService';
import { TransactionTileInfo } from '../types/TransactionTileInfo';

type Transaction = TransactionTileInfo & { createdDate: string };
type TransactionSection = { title: string; data: Transaction[] };

const ALL_STATUS_CODES: StatusCode[] = ['PENDING', 'COMPLETED', 'DECLINED'];

const getStatusCodes = (status: StatusFilter | null): StatusCode[] => {
  if (status === 'ALL') return ALL_STATUS_CODES;
  if (status) return [status];
  return [];
};

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [sections, setSections] = useState<TransactionSection[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter | null>(null);
  const [transactionNumber, setTransactionNumber] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [queryParams, setQueryParams] = useState<{
    page: number;
    filters: {
      statusCodes: StatusCode[];
      transactionNumber: string;
    };
  }>({
    page: 1,
    filters: {
      statusCodes: [],
      transactionNumber: '',
    },
  });
  const router = useRouter();
  const todayStr = new Date().toDateString();
  const handleResetFilters = () => {
    setSelectedStatus(null);
    setTransactionNumber('');
    setAllTransactions([]);
  };
  const handleApply = () => {
    setAllTransactions([]);
    setQueryParams((prev) => ({
      page: 1,
      filters: {
        statusCodes: getStatusCodes(selectedStatus),
        transactionNumber: transactionNumber.trim(),
      },
    }));
    setModal(false);
  };
  const handleTransactionSearch = () => {
    setAllTransactions([]);
    setQueryParams((prev) => ({
      page: 1,
      filters: {
        ...prev.filters,
        transactionNumber: transactionNumber.trim(),
      },
    }));
  };
  const handleTransactionNumberChange = (value: string) => {
    setTransactionNumber(value.replace(/\D/g, '').slice(0, 6));
  };
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const {
        data: { response },
      } = await getRecollectionCenterTransactions({
        page: queryParams.page,
        selectedDay: selectedDay,
        filters: JSON.stringify(queryParams.filters),
      });
      setTotalCount(response.totalCount);
      const updatedTransactions =
        queryParams.page === 1
          ? response.transactions
          : [...allTransactions, ...response.transactions];
      setAllTransactions(updatedTransactions);
      const sortedTransactions = sortByDateProp(updatedTransactions, 'createdDate');
      const grouped = groupByDate(sortedTransactions, 'createdDate');
      const newSections = Object.entries(grouped).map(([dateKey, items]) => ({
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

  const handleSelectedStatus = (status: StatusFilter) => {
    setSelectedStatus((previous) => (previous === status ? null : status));
  };

  const handleFilterModal = () => {
    setModal(true);
  };
  useEffect(() => {
    fetchTransactions();
  }, [queryParams]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewTransaction = (newTransaction: Transaction) => {
      console.log('Nueva transacción recibida:', newTransaction);
      setTotalCount(totalCount + 1);
      setAllTransactions((prev) => {
        const updated = [newTransaction, ...prev];
        const sorted = sortByDateProp(updated, 'createdDate');
        const grouped = groupByDate(sorted, 'createdDate');
        const newSections = Object.entries(grouped).map(([dateKey, items]) => ({
          title: dateKey === todayStr ? 'Today' : formatTransactionDate(dateKey, false),
          data: items,
        }));
        setSections(newSections);
        return updated;
      });
    };
    socket.on(SOCKET_EVENT_NEW_TRANSACTION, handleNewTransaction);
    return () => {
      socket.off(SOCKET_EVENT_NEW_TRANSACTION, handleNewTransaction);
    };
  }, [todayStr]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdatedTransaction = (updatedTransaction: { id: number; statusCode: string }) => {
      let updatedTx: (typeof allTransactions)[0] | undefined;
      setAllTransactions((prevTransactions) =>
        prevTransactions.map((transaction) => {
          if (transaction.transactionId === updatedTransaction.id) {
            updatedTx = { ...transaction, statusCode: Number(updatedTransaction.statusCode) };
            return updatedTx;
          }
          return transaction;
        })
      );
      if (!updatedTx) return;
      const transactionDate = formatTransactionDate(updatedTx.createdDate, false);
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.title !== transactionDate) return section;

          const updatedData = section.data.map((transaction) =>
            transaction.transactionId === updatedTransaction.id
              ? { ...transaction, statusCode: Number(updatedTransaction.statusCode) }
              : transaction
          );
          return { ...section, data: updatedData };
        })
      );
    };
    socket.on(SOCKET_EVENT_TRANSACTION_UPDATED, handleUpdatedTransaction);
    return () => {
      socket.off(SOCKET_EVENT_TRANSACTION_UPDATED, handleUpdatedTransaction);
    };
  }, []);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TransactionFiltersModal
          visible={modal}
          selectedStatus={selectedStatus}
          onStatusChange={handleSelectedStatus}
          onClose={() => setModal(false)}
          onReset={handleResetFilters}
          onApply={handleApply}
        />

        <Modal
          visible={calendarModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setCalendarModal(false)}>
          {/* Fondo semi-transparente */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Contenedor del calendario */}
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
                elevation: 10,
              }}>
              {/* Botón de cerrar */}
              <TouchableOpacity
                onPress={() => {
                  setCalendarModal(false);
                  setQueryParams((prev) => ({ ...prev, page: 1 }));
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 10,
                  padding: 8,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#333',
                  }}>
                  ✕
                </Text>
              </TouchableOpacity>

              {/* Botón de reset */}
              <TouchableOpacity
                onPress={() => setSelectedDay('')}
                style={{
                  alignSelf: 'flex-end',
                  padding: 8,
                  opacity: selectedDay ? 1 : 0,
                  backgroundColor: colors.light_gray,
                  borderRadius: 8,
                }}>
                <Text style={{ color: colors.dark_blue }}>Clear Date</Text>
              </TouchableOpacity>

              {/* Calendario */}
              <Calendar
                current={selectedDay || undefined}
                onDayPress={(day) => {
                  setSelectedDay(day.dateString);
                }}
                markedDates={
                  selectedDay
                    ? { [selectedDay]: { selected: true, selectedColor: colors.green } }
                    : {}
                }
                style={{
                  marginTop: 20,
                }}
              />
            </View>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            paddingHorizontal: 16,
            gap: 6,
          }}>
          <TextInput
            value={transactionNumber}
            onChangeText={handleTransactionNumberChange}
            onSubmitEditing={handleTransactionSearch}
            placeholder="Search transaction number"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            returnKeyType="search"
            style={{
              backgroundColor: colors.white,
              borderRadius: 10,
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              color: colors.dark_blue,
              fontFamily: 'OpenSans-SemiBold',
              fontSize: 12,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12,
            }}>
            <Filter size={20} onPress={handleFilterModal}></Filter>
            <CalendarIcon size={20} onPress={() => setCalendarModal(true)}></CalendarIcon>
          </View>
        </View>
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
          renderSectionHeader={({ section }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
                {section.title}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.light_gray,
                }}
              />
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
                {`${section.data.length} ${section.data.length === 1 ? 'order' : 'orders'}`}
              </Text>
            </View>
          )}
          onEndReached={() => {
            const totalLoaded = allTransactions.length;
            const hasMore = totalLoaded < totalCount;
            if (hasMore && !isLoading) {
              setQueryParams((prev) => ({ ...prev, page: queryParams.page + 1 }));
            }
          }}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ gap: 16, padding: 18 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={[commonStyles.paragraph, { color: colors.gray }]}>
                No se encontraron transacciones
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
