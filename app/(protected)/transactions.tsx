import axios from 'axios';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import FilterChip from '../components/FilterChip';
import BackArrow from '../components/icons/BackArrow';
import Filter from '../components/icons/Filter';
import LoadingOverlay from '../components/LoadingSpinner';
import TransactionTile from '../components/TransactionTile';
import {
  FEMALE_GENDER_ID,
  FIVE_TO_NINE_YEARS_ID,
  MALE_GENDER_ID,
  SOCKET_EVENT_NEW_TRANSACTION,
  SOCKET_EVENT_TRANSACTION_UPDATED,
  TEN_TO_FOURTEEN_YEARS_ID,
  TWO_TO_FOUR_YEARS_ID,
} from '../helpers/constants';
import { formatTransactionDate, groupByDate, sortByDateProp } from '../helpers/helpers';
import CalendarIcon from '../components/icons/CalendarIcon';
import { Calendar } from 'react-native-calendars';
import { getSocket } from '../socketService';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [boxNumberMax, setBoxNumberMax] = useState('');
  const [boxNumberMin, setBoxNumberMin] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [queryParams, setQueryParams] = useState<{
    page: number;
    filters: {
      ageFilters: string[];
      genderValues: string[];
      filterMode: 'exact' | 'minimum' | 'maximum' | 'range' | null;
      numberOfBoxes: number | null;
      maxNumberOfBoxes: number | null;
    };
  }>({
    page: 1,
    filters: {
      ageFilters: [],
      genderValues: [],
      filterMode: null,
      numberOfBoxes: null,
      maxNumberOfBoxes: null,
    },
  });

  const [dropdownOptions, setDropdownOptions] = useState([
    { label: 'Exact', value: 'exact' },
    { label: 'Minimum', value: 'minimum' },
    { label: 'Maximum', value: 'maximum' },
    { label: 'Range', value: 'range' },
  ]);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL || 'https://blessedbox.org';
  const API_PORT = extra?.PORT;
  const todayStr = new Date().toDateString();
  const ages = [
    {
      label: 'All',
      value: [TWO_TO_FOUR_YEARS_ID, FIVE_TO_NINE_YEARS_ID, TEN_TO_FOURTEEN_YEARS_ID],
    },
    { label: '2-4', value: [TWO_TO_FOUR_YEARS_ID] },
    { label: '5-9', value: [FIVE_TO_NINE_YEARS_ID] },
    { label: '10-14', value: [TEN_TO_FOURTEEN_YEARS_ID] },
  ];

  const [selectedAges, setSelectedAges] = useState([]);
  const genders = [
    { label: 'All', value: [MALE_GENDER_ID, FEMALE_GENDER_ID] },
    { label: 'Female', value: [FEMALE_GENDER_ID] },
    { label: 'Male', value: [MALE_GENDER_ID] },
    { label: 'Unlabeled', value: [] },
  ];

  const [selectedGenders, setSelectedGenders] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dropdownValue) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [dropdownValue]);
  const handleSetBoxNumberMin = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '' || (Number(numericValue) >= 1 && Number(numericValue) <= 100)) {
      setBoxNumberMin(numericValue);
    }
  };
  const handleSetBoxNumberMax = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '' || (Number(numericValue) >= 1 && Number(numericValue) <= 100)) {
      setBoxNumberMax(numericValue);
    }
  };
  const handleResetFilters = () => {
    setDropdownValue(null);
    setBoxNumberMin('');
    setBoxNumberMax('');
    setOpenDropdown(false);
    setAllTransactions([]);
    setSelectedGenders([]);
    setSelectedAges([]);
  };
  const handleApply = () => {
    const built = buildFilters();
    if (!built) return;

    setAllTransactions([]);
    setQueryParams((prev) => ({
      page: 1,
      filters: {
        ageFilters: built.ageFilters,
        genderValues: built.genderValues,
        filterMode: built.filterMode,
        numberOfBoxes: built.numberOfBoxes,
        maxNumberOfBoxes: built.maxNumberOfBoxes,
      },
    }));
    setModal(false);
  };
  const buildFilters = () => {
    const isSingleDropdownValue = ['exact', 'minimum', 'maximum'].includes(dropdownValue);
    if (isSingleDropdownValue) {
      if (!boxNumberMin) {
        Alert.alert('Validation Error', 'Please enter a value.');
        return null;
      }
    } else if (dropdownValue === 'range') {
      if (!boxNumberMin || !boxNumberMax) {
        Alert.alert('Validation Error', 'Both min and max are required.');
        return null;
      }
      const min = parseFloat(boxNumberMin);
      const max = parseFloat(boxNumberMax);
      if (isNaN(min) || isNaN(max)) {
        Alert.alert('Validation Error', 'Values must be numbers.');
        return null;
      }
      if (min >= max) {
        Alert.alert('Validation Error', 'Min must be less than Max.');
        return null;
      }
    }
    return {
      ageFilters: selectedAges,
      genderValues: selectedGenders,
      filterMode: dropdownValue,
      numberOfBoxes: boxNumberMin ? parseInt(boxNumberMin) : null,
      maxNumberOfBoxes: dropdownValue === 'range' ? parseInt(boxNumberMax) : null,
    };
  };
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const {
        data: { response },
      } = await axios.get(`${API_URL}/api/transactions/recollectionCenterTransactions`, {
        params: {
          page: queryParams.page,
          selectedDay: selectedDay,
          filters: JSON.stringify(queryParams.filters),
        },
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

  const handleSelectedAge = (label: string) => {
    setSelectedAges((prev) => {
      if (label === 'All') {
        return prev.includes('All') ? [] : ['All'];
      }

      let newSelection = prev.filter((item) => item !== 'All');
      if (newSelection.includes(label)) {
        newSelection = newSelection.filter((item) => item !== label);
      } else {
        newSelection.push(label);
      }

      const specificLabels = ['2-4', '5-9', '10-14'];
      if (specificLabels.every((l) => newSelection.includes(l))) {
        return ['All'];
      }

      return newSelection;
    });
  };

  const handleSelectedGender = (label: string) => {
    setSelectedGenders((prev) => {
      if (label === 'All') {
        return prev.includes('All') ? [] : ['All'];
      }

      let newSelection = prev.filter((item) => item !== 'All');
      if (newSelection.includes(label)) {
        newSelection = newSelection.filter((item) => item !== label);
      } else {
        newSelection.push(label);
      }

      const specificLabels = ['Female', 'Male', 'Unlabeled'];
      if (specificLabels.every((l) => newSelection.includes(l))) {
        return ['All'];
      }

      return newSelection;
    });
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

    const handleNewTransaction = (newTransaction) => {
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
            updatedTx = { ...transaction, status: updatedTransaction.statusCode };
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
            transaction.id === updatedTransaction.id
              ? { ...transaction, status: updatedTransaction.statusCode }
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
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal visible={modal} animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.backgroundColor,
              }}>
              {/* Header Container */}
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                <BackArrow
                  onPress={() => {
                    setModal(false);
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={commonStyles.header}>Filters</Text>
                </View>
                <View style={{ width: 25 }} />
              </View>

              {/* Main Container */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 16 }}>
                <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
                  Filter by Recollection Center
                </Text>

                {/* Country Container */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 2,
                    borderBottomColor: colors.dark_gray,
                  }}>
                  <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
                    Country
                  </Text>
                  <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>Puerto Rico</Text>
                </View>

                {/* Recollection Center Container */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 2,
                    borderBottomColor: colors.dark_gray,
                  }}>
                  <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>RC</Text>
                  <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
                    Iglesia Cristiana Bethlehem
                  </Text>
                </View>

                {/* Number of Boxes Container */}
                <View style={{ display: 'flex', gap: 16, paddingVertical: 4 }}>
                  <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
                    Filter by Number of Boxes
                  </Text>
                  <DropDownPicker
                    open={openDropdown}
                    value={dropdownValue}
                    items={dropdownOptions}
                    setOpen={setOpenDropdown}
                    setValue={setDropdownValue}
                    setItems={setDropdownOptions}
                    placeholder="Select option"
                    style={{
                      borderColor: colors.light_gray,
                      borderRadius: 10,
                      paddingVertical: 0,
                    }}
                    textStyle={[commonStyles.paragraph, { color: colors.dark_blue }]}
                    dropDownContainerStyle={{ borderColor: colors.light_gray, borderRadius: 10 }}
                    arrowIconStyle={{ tintColor: colors.dark_blue }}
                  />

                  <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
                    {dropdownValue && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {/* Input Min or Exact */}
                        <TextInput
                          style={{
                            flex: 1,
                            height: 50,
                            backgroundColor: colors.white,
                            textAlign: 'center',
                            borderWidth: 1,
                            borderColor: colors.light_gray,
                            borderRadius: 10,
                          }}
                          value={boxNumberMin}
                          onChangeText={handleSetBoxNumberMin}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={colors.light_gray}
                        />

                        {/* Range mode */}
                        {dropdownValue === 'range' && (
                          <>
                            <Text style={[commonStyles.paragraph, { flex: 0 }]}>to</Text>
                            <TextInput
                              style={{
                                flex: 1,
                                height: 50,
                                backgroundColor: colors.white,
                                textAlign: 'center',
                                borderWidth: 1,
                                borderColor: colors.light_gray,
                                borderRadius: 10,
                              }}
                              value={boxNumberMax}
                              onChangeText={handleSetBoxNumberMax}
                              keyboardType="numeric"
                              placeholder="Max"
                              placeholderTextColor={colors.light_gray}
                            />
                          </>
                        )}
                      </View>
                    )}
                  </Animated.View>
                </View>

                {/* Filter by Age Container */}
                <View style={{ display: 'flex', gap: 16, width: '100%', paddingVertical: 4 }}>
                  <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>Filter by Age</Text>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    {ages.map((item) => (
                      <FilterChip
                        key={item.label}
                        label={item.label}
                        onPress={() => handleSelectedAge(item.label)}
                        selected={selectedAges.includes(item.label)}></FilterChip>
                    ))}
                  </View>
                </View>

                {/* Filter by Gender Container */}
                <View style={{ display: 'flex', gap: 16, width: '100%', paddingVertical: 4 }}>
                  <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>Filter by Gender</Text>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    {genders.map((item) => (
                      <FilterChip
                        key={item.label}
                        label={item.label}
                        onPress={() => handleSelectedGender(item.label)}
                        selected={selectedGenders.includes(item.label)}></FilterChip>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Buttons Container */}
            <View style={{ width: '100%', position: 'relative' }}>
              {/* Shadow top */}
              <LinearGradient
                colors={['rgba(0,0,0,0.15)', 'transparent']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, zIndex: 10 }}
              />

              {/* Row de botones */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.white,
                  padding: 20,
                  width: '100%',
                  gap: 12,
                }}>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    {
                      flex: 1,
                      backgroundColor: colors.white,
                      borderWidth: 2,
                      borderColor: colors.dark_blue,
                    },
                  ]}
                  onPress={handleResetFilters}>
                  <Text style={[commonStyles.header, { color: colors.dark_blue }]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    commonStyles.buttonNoShadow,
                    { flex: 1, backgroundColor: colors.dark_blue },
                  ]}
                  onPress={handleApply}>
                  <Text style={[commonStyles.header, { color: colors.white }]}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

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
          <View style={{ backgroundColor: colors.white, borderRadius: 10, flex: 1, padding: 6 }}>
            <Text style={commonStyles.paragraphItalic}>Coming soon</Text>
          </View>
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
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>{title}</Text>
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
