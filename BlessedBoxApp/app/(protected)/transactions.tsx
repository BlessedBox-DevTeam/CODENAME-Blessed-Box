import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
import { FEMALE_GENDER_ID, FIVE_TO_NINE_YEARS_ID, MALE_GENDER_ID, TEN_TO_FOURTEEN_YEARS_ID, TWO_TO_FOUR_YEARS_ID } from '../helpers/constants';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [sections, setSections] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [boxNumber, setBoxNumber] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([
    { label: 'Exact', value: 'exact' },
    { label: 'Minimum', value: 'minimum' },
    { label: 'Maximum', value: 'maximum' },
    { label: 'Range', value: 'range' },
  ]);
  const router = useRouter();
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;
  const todayStr = new Date().toDateString();
  const ages = [
    { label: 'All', value: [TWO_TO_FOUR_YEARS_ID, FIVE_TO_NINE_YEARS_ID, TEN_TO_FOURTEEN_YEARS_ID] },
    { label: '2-4', value: [TWO_TO_FOUR_YEARS_ID] },
    { label: '5-9', value: [FIVE_TO_NINE_YEARS_ID] },
    { label: '10-14', value: [TEN_TO_FOURTEEN_YEARS_ID] },
  ];

  const [selectedAges, setSelectedAges] = useState(['All']);
  const genders = [
    { label: 'All', value: [MALE_GENDER_ID, FEMALE_GENDER_ID] },
    { label: 'Female', value: [FEMALE_GENDER_ID] },
    { label: 'Male', value: [MALE_GENDER_ID] },
    { label: 'Unlabeled', value: [] },
  ];

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

  const handleSelectedAge = (label) => {
    setSelectedAges((prev) => {
      // Si presiona "All"
      if (label === 'All') {
        return ['All'];
      }

      // Si All estaba seleccionado y toca algo distinto
      if (prev.includes('All')) {
        return [label];
      }

      // Alternar selección normal
      let newSelection = prev.includes(label)
        ? prev.filter((item) => item !== label) // remover si ya estaba
        : [...prev, label]; // agregar si no estaba

      // Si seleccionó todas las opciones específicas → activar ALL
      if (['2-4', '5-9', '10-14'].every((l) => newSelection.includes(l))) {
        return ['All'];
      }

      return newSelection;
    });
  };
  const handleSelectedGender = (label) => {
    setSelectedGenders((prev) => {
      // Si presiona "All"
      if (label === 'All') {
        return ['All'];
      }

      // Si All estaba seleccionado y toca otra opción
      if (prev.includes('All')) {
        return [label];
      }

      // Alternar selección normal
      let newSelection = prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label];

      // Si seleccionó todas las opciones específicas → activar ALL
      if (['Female', 'Male', 'Unlabeled'].every((l) => newSelection.includes(l))) {
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
            <View style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 16 }}>
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
                <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>Iglesia Cristiana Bethlehem</Text>
              </View>
              {/* Number of Boxes Container */}
              <View style={{ display: 'flex', gap: 16, paddingVertical: 4 }}>
                <Text style={commonStyles.paragraph}>Filter by Number of Boxes</Text>
                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', width: '100%' }}>
                  <View style={{ flex: 2 }}>
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
                  </View>
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
                    value={boxNumber}
                    onChangeText={setBoxNumber}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.light_gray}
                  />
                </View>
              </View>
              {/* Filter by Age Container */}
              <View style={{ display: 'flex', gap: 16, width: '100%', paddingVertical: 4 }}>
                <Text style={commonStyles.paragraph}>Filter by Age</Text>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  {ages.map((item) => (
                    <FilterChip key={item.label} label={item.label} onPress={() => handleSelectedAge(item.label)} selected={selectedAges.includes(item.label)}></FilterChip>
                  ))}
                </View>
              </View>
              {/* Filter by Gender Container */}
              <View style={{ display: 'flex', gap: 16, width: '100%', paddingVertical: 4 }}>
                <Text style={commonStyles.paragraph}>Filter by Gender</Text>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                  {genders.map((item) => (
                    <FilterChip key={item.label} label={item.label} onPress={() => handleSelectedGender(item.label)} selected={selectedGenders.includes(item.label)}></FilterChip>
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
