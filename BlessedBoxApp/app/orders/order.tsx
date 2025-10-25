import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, LayoutAnimation, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BoxLabel, { BoxLabelType } from '../components/BoxLabel';
import BackArrow from '../components/icons/BackArrow';
import PlusSign from '../components/icons/PlusSign';
import { BoxLabelInfo } from '../types/BoxLabelInfo';

/**
 * Order Entry Screen
 *
 * Allows users to input the total number of shoeboxes,
 * create individual Box Labels, and navigate to the Order Summary.
 *
 * @returns {JSX.Element} React component for entering orders
 */
export default function Index() {
  /** Array of box label IDs */
  const [boxLabels, setBoxLabels] = useState<number[]>([0]);

  /** Counter to assign unique IDs to new box labels */
  const nextId = useRef(1);

  /** Total number of boxes input by the user */
  const [totalBoxes, setTotalBoxes] = useState('1');

  /** Ref to scroll view for auto-scrolling when adding labels */
  const scrollRef = useRef<ScrollView>(null);

  /** Refs to each BoxLabel component */
  const boxRefs = useRef<{ [key: number]: BoxLabelType | null }>({});

  /** Error state for totalBoxes input */
  const [totalBoxesError, setTotalBoxesError] = useState('');

  /** Error state for individual box labels */
  const [boxErrors, setBoxErrors] = useState<{ [key: number]: string }>({});

  /** Error state for total boxes border */
  const [inputBorderColor, setInputBorderColor] = useState(colors.light_gray);

  /**
   * Add a new BoxLabel
   * Limits the number of labels to 6
   */
  const handleAddBoxLabel = () => {
    setBoxLabels((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, nextId.current++];
    });
    setTimeout(() => {
      if (boxLabels.length < 6) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  /**
   * Delete a BoxLabel by ID
   * Animates the removal on Android and iOS
   *
   * @param {number} id - ID of the box label to remove
   */
  const handleDeleteBoxLabel = (id: number) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBoxLabels((prev) => prev.filter((boxId) => boxId !== id));
  };

  /** Navigate back to the QR Code screen */
  const handleBackPress = () => router.back();

  /**
   * Continue button handler
   *
   * Validates total boxes and individual label quantities,
   * merges duplicate labels by age/gender, and navigates to Order Summary
   */
  const handleContinue = () => {
    const total = Number(totalBoxes);
    let newErrors: { [key: number]: string } = {};

    // Validate total boxes input
    if (!total || total < 1 || total > 100) {
      Alert.alert('Error', 'The total number of boxes must be between 1 and 100.');
      return;
    }

    const allData = boxLabels.map((id) => boxRefs.current[id]?.getData());
    let sumQuantity = 0;

    allData.forEach((item, idx) => {
      if (!item) return;
      sumQuantity += item.quantity;

      if (item.quantity > total) {
        newErrors[boxLabels[idx]] = 'Exceeds total';
      }
    });

    // Global error if sum exceeds total
    if (sumQuantity > total) {
      boxLabels.forEach((id) => {
        if (allData.find((item) => item && item.quantity > 0)) {
          newErrors[id] = 'Sum exceeds total';
        }
      });
    }

    setBoxErrors(newErrors);
    setInputBorderColor(Object.keys(newErrors).length > 0 ? colors.red : colors.light_gray);
    if (Object.keys(newErrors).length > 0) return;

    // Merge duplicates by age and gender
    const mergedData: BoxLabelInfo[] = Array.from(
      allData.reduce((map, item) => {
        if (!item) return map;
        const key = `${item.boxAgeId}-${item.genderId ?? 'any'}`;
        if (!map.has(key)) {
          map.set(key, { ...item });
        } else {
          map.get(key)!.quantity += item.quantity;
        }
        return map;
      }, new Map<string, BoxLabelInfo>())
    ).map(([_, value]) => value);

    // Add remaining boxes as unlabeled if sum < total
    const remaining = total - sumQuantity;
    if (remaining > 0) {
      mergedData.push({
        boxAgeId: false as any,
        genderId: false as any,
        quantity: remaining,
      });
    }

    router.push({
      pathname: '/orders/orderSummary',
      params: { boxLabels: JSON.stringify(mergedData) },
    });
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <BackArrow onPress={handleBackPress} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Enter Order</Text>
          </View>
          <View style={{ width: 25 }} />
        </View>

        {/* Main Section */}
        <View style={{ display: 'flex', flex: 1, gap: 16 }}>
          {/* Total Boxes Card */}
          <View
            style={[
              commonStyles.card,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 24,
                marginHorizontal: 16,
              },
            ]}>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Total Boxes</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: inputBorderColor,
                padding: 5,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}>
              <TextInput
                value={totalBoxes}
                keyboardType="numeric"
                style={[commonStyles.paragraph, { color: colors.dark_blue }]}
                selectTextOnFocus
                maxLength={3}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^0-9]/g, '');
                  setTotalBoxes(filtered);
                  if (totalBoxesError) setTotalBoxesError('');
                }}
                onBlur={() => {
                  let num = Number(totalBoxes);
                  if (!totalBoxes || isNaN(num)) {
                    setTotalBoxes('1');
                    setTotalBoxesError('Must enter a number between 1 and 100');
                  } else if (num < 1) {
                    setTotalBoxes('1');
                    setTotalBoxesError('Minimum value is 1');
                  } else if (num > 100) {
                    setTotalBoxes('100');
                    setTotalBoxesError('Maximum value is 100');
                  } else {
                    setTotalBoxes(String(num));
                    setTotalBoxesError('');
                  }
                }}
              />
              <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>★</Text>
            </View>
          </View>

          {/* Enable Shoebox Controller */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Enable Shoebox Label</Text>
          </View>

          {/* ScrollView of Box Labels */}
          <ScrollView
            ref={scrollRef}
            style={{ paddingHorizontal: 16, paddingBottom: 16, flexGrow: 0 }}
            contentContainerStyle={{ gap: 16 }}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag">
            {boxLabels.map((id) => (
              <BoxLabel
                key={id}
                ref={(r) => {
                  boxRefs.current[id] = r;
                }}
                onDelete={() => handleDeleteBoxLabel(id)}
                error={boxErrors[id]}
              />
            ))}
          </ScrollView>

          {/* Add BoxLabel Button */}
          <View
            style={{
              alignSelf: 'center',
              width: 36,
              height: 36,
              backgroundColor: colors.white,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: boxLabels.length >= 6 ? 0.4 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.22,
              shadowRadius: 3,
              elevation: 3,
            }}>
            <PlusSign width={28} height={28} onPress={boxLabels.length >= 6 ? undefined : handleAddBoxLabel} />
          </View>

          {/* Continue Button */}
          <View style={{ marginTop: 'auto', paddingHorizontal: 16, paddingBottom: 16 }}>
            <TouchableOpacity style={[commonStyles.button]} onPress={handleContinue}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
