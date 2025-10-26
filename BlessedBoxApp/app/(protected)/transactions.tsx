import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import FilterChip from '../components/FilterChip';
import BackArrow from '../components/icons/BackArrow';
import Filter from '../components/icons/Filter';
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
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;
  const todayStr = new Date().toDateString();
  const ages = ['All', '2-4', '5-9', '10-14'];
  const [selectedAges, setSelectedAges] = useState(['All']);
  const genders = ['All', 'Female', 'Male', 'Unlabeled'];
  const [selectedGenders, setSelectedGenders] = useState(['All']);

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

  const handleSelectedAge = (item) => {
    setSelectedAges((prev) => {
      if (prev.includes(item)) {
        // Si ya está seleccionado, lo removemos
        return prev.filter((i) => i !== item);
      } else {
        // Si no está, lo agregamos
        return [...prev, item];
      }
    });
  };
  const handleSelectedGender = (item) => {
    setSelectedGenders((prev) => {
      if (prev.includes(item)) {
        // Si ya está seleccionado, lo removemos
        return prev.filter((i) => i !== item);
      } else {
        // Si no está, lo agregamos
        return [...prev, item];
      }
    });
  };
  const handleFilterModal = () => {
    setModal(true);
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
        <Modal visible={modal} animationType="slide">
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
            <View style={{ paddingHorizontal: 16, gap: 16 }}>
              <Text style={commonStyles.paragraph}>Filter by Recollection Center</Text>
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
                <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Country</Text>
                <Text style={[commonStyles.paragraph]}>Puerto Rico</Text>
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
                <Text style={[commonStyles.paragraph]}>Iglesia Cristiana Bethlehem</Text>
              </View>
              {/* Number of Boxes Container */}
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Min number */}
                <View style={{ backgroundColor: colors.white, borderRadius: 25, width: 75, padding: 25 }}>
                  <Text>5</Text>
                  <View style={{ backgroundColor: colors.light_gray }}>
                    <Text>x</Text>
                  </View>
                </View>
                <Text>to</Text>
                {/* Max number */}
                <View style={{ backgroundColor: colors.white, borderRadius: 25, width: 75, padding: 25 }}>
                  <Text>20</Text>
                  <View style={{ backgroundColor: colors.light_gray }}>
                    <Text>x</Text>
                  </View>
                </View>
              </View>
              {/* Filter by Age Container */}
              <View style={{ display: 'flex', gap: 16, width: '100%' }}>
                <Text style={commonStyles.paragraph}>Filter by Age</Text>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  {ages.map((item) => (
                    <FilterChip label={item} onPress={() => handleSelectedAge(item)} selected={selectedAges.includes(item)}></FilterChip>
                  ))}
                </View>
              </View>
              {/* Filter by Gender Container */}
              <View style={{ display: 'flex', gap: 16, width: '100%' }}>
                <Text style={commonStyles.paragraph}>Filter by Gender</Text>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  {genders.map((item) => (
                    <FilterChip label={item} onPress={() => handleSelectedGender(item)} selected={selectedGenders.includes(item)}></FilterChip>
                  ))}
                </View>
              </View>
            </View>
          </View>
          {/* Buttons Container */}
          <View style={{ width: '100%', position: 'relative' }}>
            {/* Shadow top */}
            <LinearGradient colors={['rgba(0,0,0,0.15)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, zIndex: 10 }} />

            {/* Row de botones */}
            <View style={{ flexDirection: 'row', backgroundColor: colors.white, padding: 20, width: '100%', gap: 12 }}>
              <TouchableOpacity style={[commonStyles.buttonNoShadow, { flex: 1, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.dark_blue }]} onPress={() => {}}>
                <Text style={[commonStyles.header, { color: colors.dark_blue }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[commonStyles.buttonNoShadow, { flex: 1, backgroundColor: colors.dark_blue }]} onPress={() => {}}>
                <Text style={[commonStyles.header, { color: colors.white }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Filter size={20} onPress={handleFilterModal}></Filter>
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
