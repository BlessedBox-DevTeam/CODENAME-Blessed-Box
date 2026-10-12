import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../baseStyles/colors';
import {
  FEMALE_GENDER_ID,
  FIVE_TO_NINE_YEARS_ID,
  MALE_GENDER_ID,
  TEN_TO_FOURTEEN_YEARS_ID,
  TWO_TO_FOUR_YEARS_ID,
  UNLABELED_GENDER_ID,
} from '../helpers/constants';
import { BoxLabelInfo } from '../types/BoxLabelInfo';
import AgeHeaders from '../components/order/AgeHeaders';
import CategoryRow from '../components/order/CategoryRow';
import OrderSummaryCard from '../components/order/OrderSummaryCard';
import SelectedCategoryController from '../components/order/SelectedCategoryController';
import {
  AgeIndex,
  BoxKey,
  BoxValues,
  GENDERS,
  Gender,
  INITIAL_BOX_VALUES,
} from '../components/order/orderTypes';

const AGE_IDS = [TWO_TO_FOUR_YEARS_ID, FIVE_TO_NINE_YEARS_ID, TEN_TO_FOURTEEN_YEARS_ID] as const;

export default function OrderScreen() {
  const { width, height } = useWindowDimensions();
  const compact = height < 700;
  const small = height < 780;
  const horizontalPadding = width < 380 ? 16 : 24;
  const headerHeight = compact ? 58 : small ? 66 : 74;
  const headerButtonSize = compact ? 40 : small ? 44 : 48;
  const gap = 8;
  const cellSize = (width - horizontalPadding * 2 - gap * 3) / 4;
  const cellHeight = Math.min(cellSize, compact ? 68 : 100);

  const [values, setValues] = useState<BoxValues>(INITIAL_BOX_VALUES);
  const [selectedBox, setSelectedBox] = useState<BoxKey | null>(null);

  const totalBoxes = useMemo(
    () => Object.values(values).reduce((total, value) => total + value, 0),
    [values]
  );

  const totals: Record<Gender, number> = {
    girl: values['girl-0'] + values['girl-1'] + values['girl-2'],
    boy: values['boy-0'] + values['boy-1'] + values['boy-2'],
    unlabeled: values['unlabeled-0'] + values['unlabeled-1'] + values['unlabeled-2'],
  };

  const selectedGender = selectedBox?.split('-')[0] as Gender | undefined;
  const selectedConfig = GENDERS.find(({ key }) => key === selectedGender) ?? null;
  const selectedAgeIndex = selectedBox ? (Number(selectedBox.slice(-1)) as AgeIndex) : null;
  const selectedValue = selectedBox ? values[selectedBox] : 0;

  const handleSelectBox = (key: BoxKey) => {
    setSelectedBox(key);
    setValues((previous) => ({
      ...previous,
      [key]: previous[key] + 1,
    }));
  };

  const adjustSelectedBox = (amount: number) => {
    if (!selectedBox) return;

    setValues((previous) => ({
      ...previous,
      [selectedBox]: Math.max(0, previous[selectedBox] + amount),
    }));
  };

  const resetSelectedBox = () => {
    if (!selectedBox) return;

    setValues((previous) => ({
      ...previous,
      [selectedBox]: 0,
    }));
  };

  const resetAllBoxes = () => {
    setValues({ ...INITIAL_BOX_VALUES });
    setSelectedBox(null);
  };

  const createBoxData = (): BoxLabelInfo[] => {
    const result: BoxLabelInfo[] = [];

    GENDERS.forEach(({ key: gender }) => {
      AGE_IDS.forEach((ageId, ageIndex) => {
        const boxKey = `${gender}-${ageIndex}` as BoxKey;
        const quantity = values[boxKey];

        if (quantity === 0) return;

        result.push({
          boxAgeId: ageId,
          genderId:
            gender === 'unlabeled'
              ? UNLABELED_GENDER_ID
              : gender === 'girl'
                ? FEMALE_GENDER_ID
                : MALE_GENDER_ID,
          quantity,
        });
      });
    });

    return result;
  };

  const handleContinue = () => {
    if (totalBoxes < 1) {
      Alert.alert('Error', 'Please add at least one box.');
      return;
    }

    router.push({
      pathname: '/orders/orderSummary',
      params: { boxLabels: JSON.stringify(createBoxData()) },
    });
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { height: headerHeight, paddingHorizontal: horizontalPadding }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={[
              styles.headerButton,
              { width: headerButtonSize, height: headerButtonSize, borderRadius: headerButtonSize / 2 },
            ]}>
            <Feather name="chevron-left" size={compact ? 22 : 26} color={colors.orderText} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontSize: compact ? 18 : small ? 20 : 22 }]}>
            Enter Order
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Reset all categories"
            onPress={resetAllBoxes}
            style={[
              styles.headerButton,
              { width: headerButtonSize, height: headerButtonSize, borderRadius: headerButtonSize / 2 },
            ]}>
            <Feather name="rotate-ccw" size={compact ? 18 : 20} color={colors.orderTextReset} />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
          <OrderSummaryCard total={totalBoxes} totals={totals} compact={compact} />

          <AgeHeaders compact={compact} gap={gap} />

          {GENDERS.map((config, index) => (
            <CategoryRow
              key={config.key}
              config={config}
              values={values}
              selectedBox={selectedBox}
              cellHeight={cellHeight}
              gap={gap}
              bottomMargin={index < GENDERS.length - 1 ? (compact ? 7 : small ? 9 : 12) : 0}
              onSelect={handleSelectBox}
            />
          ))}

          <View style={[styles.spacer, { minHeight: compact ? 10 : small ? 14 : 20 }]} />

          <SelectedCategoryController
            config={selectedConfig}
            ageIndex={selectedAgeIndex}
            value={selectedValue}
            compact={compact}
            onAdjust={adjustSelectedBox}
            onReset={resetSelectedBox}
          />

          <TouchableOpacity
            accessibilityRole="button"
            disabled={totalBoxes === 0}
            onPress={handleContinue}
            activeOpacity={0.8}
            style={[
              styles.continueButton,
              {
                height: compact ? 52 : small ? 58 : 66,
                borderRadius: small ? 18 : 22,
                marginTop: compact ? 8 : 12,
                marginBottom: Platform.OS === 'ios' ? 12 : 28,
              },
              totalBoxes === 0 && styles.continueButtonDisabled,
            ]}>
            <Text style={[styles.continueText, totalBoxes === 0 && styles.continueTextDisabled]}>
              Continue
            </Text>
            {totalBoxes > 0 && (
              <View style={[styles.totalBadge, compact && styles.totalBadgeCompact]}>
                <Text style={[styles.totalBadgeText, compact && styles.totalBadgeTextCompact]}>
                  {totalBoxes}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.orderBackground,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.orderBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    backgroundColor: colors.orderSurfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: colors.orderText,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  continueButton: {
    backgroundColor: colors.orderContinue,
    shadowColor: colors.orderContinue,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  continueButtonDisabled: {
    backgroundColor: colors.orderSurfaceSelectedDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: colors.orderText,
    fontSize: 18,
    fontWeight: '800',
  },
  continueTextDisabled: {
    color: colors.orderTextDisabled,
  },
  totalBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 7,
    borderRadius: 16,
    backgroundColor: colors.orderBadge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBadgeCompact: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
  },
  totalBadgeText: {
    color: colors.orderText,
    fontSize: 16,
    fontWeight: '800',
  },
  totalBadgeTextCompact: {
    fontSize: 14,
  },
});
