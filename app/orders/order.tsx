// import { router, Stack } from 'expo-router';
// import React, { useRef, useState } from 'react';
// import { Alert, LayoutAnimation, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import commonStyles from '../baseStyles/baseStyles';
// import colors from '../baseStyles/colors';
// import BoxLabel, { BoxLabelType } from '../components/BoxLabel';
// import BackArrow from '../components/icons/BackArrow';
// import PlusSign from '../components/icons/PlusSign';
// import { BoxLabelInfo } from '../types/BoxLabelInfo';
// import { UNLABELED_GENDER_ID } from '../helpers/constants';
// import BlessedBox from '../components/icons/BlessedBox';

// /**
//  * Order Entry Screen
//  *
//  * Allows users to input the total number of shoeboxes,
//  * create individual Box Labels, and navigate to the Order Summary.
//  *
//  * @returns {JSX.Element} React component for entering orders
//  */
// export default function Index() {
//   /** Array of box label IDs */
//   const [boxLabels, setBoxLabels] = useState<number[]>([0]);

//   /** Counter to assign unique IDs to new box labels */
//   const nextId = useRef(1);

//   /** Total number of boxes input by the user */
//   const [totalBoxes, setTotalBoxes] = useState('1');

//   /** Ref to scroll view for auto-scrolling when adding labels */
//   const scrollRef = useRef<ScrollView>(null);

//   /** Refs to each BoxLabel component */
//   const boxRefs = useRef<{ [key: number]: BoxLabelType | null }>({});

//   /** Error state for totalBoxes input */
//   const [totalBoxesError, setTotalBoxesError] = useState('');

//   /** Error state for individual box labels */
//   const [boxErrors, setBoxErrors] = useState<{ [key: number]: string }>({});

//   /** Error state for total boxes border */
//   const [inputBorderColor, setInputBorderColor] = useState(colors.light_gray);

//   /** Sets the visible modal for the remaining unlabeled boxes */
//   const [modal, setModal] = useState(false);

//   /** Sets the amount of unlabeled boxes */
//   const [unlabeledAmount, setUnlabeled] = useState(0);

//   /** Sets the mergedData for the orderSummary screen */
//   const [mergedBoxData, setMergedBoxData] = React.useState<BoxLabelInfo[] | null>(null);

//   /**
//    * Add a new BoxLabel
//    * Limits the number of labels to 6
//    */
//   const handleAddBoxLabel = () => {
//     setBoxLabels((prev) => {
//       if (prev.length >= 6) return prev;
//       return [...prev, nextId.current++];
//     });
//     setTimeout(() => {
//       if (boxLabels.length < 6) {
//         scrollRef.current?.scrollToEnd({ animated: true });
//       }
//     }, 100);
//   };

//   /**
//    * Delete a BoxLabel by ID
//    * Animates the removal on Android and iOS
//    *
//    * @param {number} id - ID of the box label to remove
//    */
//   const handleDeleteBoxLabel = (id: number) => {
//     if (Platform.OS === 'android') {
//       UIManager.setLayoutAnimationEnabledExperimental?.(true);
//     }
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setBoxLabels((prev) => prev.filter((boxId) => boxId !== id));
//   };

//   /** Navigate back to the QR Code screen */
//   const handleBackPress = () => router.back();

//   /**
//    * Continue button handler
//    *
//    * Validates total boxes and individual label quantities,
//    * merges duplicate labels by age/gender, and navigates to Order Summary
//    */
//   const handleContinue = () => {
//     const total = Number(totalBoxes);
//     let newErrors: { [key: number]: string } = {};

//     // Validate total boxes input
//     if (!total || total < 1 || total > 100) {
//       Alert.alert('Error', 'The total number of boxes must be between 1 and 100.');
//       return;
//     }

//     const allData = boxLabels.map((id) => boxRefs.current[id]?.getData());
//     let sumQuantity = 0;

//     allData.forEach((item, idx) => {
//       if (!item) return;
//       sumQuantity += item.quantity;

//       if (item.quantity > total) {
//         newErrors[boxLabels[idx]] = 'Exceeds total';
//       }
//     });

//     // Global error if sum exceeds total
//     if (sumQuantity > total) {
//       boxLabels.forEach((id) => {
//         if (allData.find((item) => item && item.quantity > 0)) {
//           newErrors[id] = 'Sum exceeds total';
//         }
//       });
//     }

//     setBoxErrors(newErrors);
//     setInputBorderColor(Object.keys(newErrors).length > 0 ? colors.red : colors.light_gray);
//     if (Object.keys(newErrors).length > 0) return;

//     // Merge duplicates by age and gender
//     const parseBoxedLabels = Array.from(
//       allData.reduce((map, item) => {
//         if (!item) return map;
//         const key = `${item.boxAgeId}-${item.genderId ?? 'any'}`;
//         if (!map.has(key)) {
//           map.set(key, { ...item });
//         } else {
//           map.get(key)!.quantity += item.quantity;
//         }
//         return map;
//       }, new Map<string, BoxLabelInfo>())
//     ).map(([_, value]) => value);

//     setMergedBoxData(parseBoxedLabels);
//     // Add remaining boxes as unlabeled if sum < total
//     const remaining = total - sumQuantity;
//     if (remaining > 0) {
//       setUnlabeled(remaining);
//       return setModal(true);
//     } else {
//       console.log(parseBoxedLabels);
//       router.push({
//         pathname: '/orders/orderSummary',
//         params: { boxLabels: JSON.stringify(parseBoxedLabels) },
//       });
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <Stack.Screen options={{ headerShown: false }} />
//       <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
//         {/* Header */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
//           <BackArrow onPress={handleBackPress} />
//           <View style={{ flex: 1, alignItems: 'center' }}>
//             <Text style={commonStyles.header}>Enter Order</Text>
//           </View>
//           <View style={{ width: 25 }} />
//         </View>

//         {/* Modal for unlabeled boxes */}
//         <Modal visible={modal} transparent animationType="fade" onRequestClose={() => setModal(false)}>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: 'rgba(0,0,0,0.4)',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <View
//               style={{
//                 width: '90%',
//                 maxWidth: 400,
//                 borderRadius: 10,
//                 backgroundColor: colors.white,
//                 padding: 32,
//                 flexDirection: 'column',
//                 alignSelf: 'center',
//               }}>
//               <Text
//                 style={[
//                   commonStyles.paragraph,
//                   { marginBottom: 32, textAlign: 'center' },
//                 ]}>{`You have ${unlabeledAmount} remaining unlabeled boxes. Do you wish to continue?`}</Text>
//               <View style={{ flexDirection: 'row', gap: 32 }}>
//                 <TouchableOpacity
//                   style={[
//                     commonStyles.buttonNoShadow,
//                     {
//                       backgroundColor: colors.white,
//                       borderColor: colors.dark_gray,
//                       borderWidth: 2,
//                       flex: 1,
//                     },
//                   ]}
//                   onPress={async () => {
//                     setUnlabeled(0);
//                     setModal(false);
//                   }}>
//                   <Text style={[commonStyles.header, { color: colors.dark_gray }]}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[commonStyles.buttonNoShadow, { backgroundColor: colors.green_label, flex: 1 }]}
//                   onPress={async () => {
//                     const updated = [
//                       ...(mergedBoxData ?? []),
//                       {
//                         boxAgeId: false,
//                         genderId: UNLABELED_GENDER_ID,
//                         quantity: unlabeledAmount,
//                       },
//                     ];
//                     setMergedBoxData(updated);
//                     setModal(false);
//                     router.push({
//                       pathname: '/orders/orderSummary',
//                       params: { boxLabels: JSON.stringify(updated) }, // usa el array actualizado
//                     });
//                   }}>
//                   <Text style={[commonStyles.header, { color: colors.white }]}>Continue</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Main Section */}
//         <View style={{ display: 'flex', flex: 1, gap: 16 }}>
//           {/* Total Boxes Card */}
//           <View
//             style={[
//               commonStyles.card,
//               {
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 paddingVertical: 12,
//                 paddingHorizontal: 24,
//                 marginHorizontal: 16,
//               },
//             ]}>
//             <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Enter total boxes</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: inputBorderColor,
//                   width: 50,
//                   borderRadius: 10,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}>
//                 <TextInput
//                   value={totalBoxes}
//                   keyboardType="numeric"
//                   style={[commonStyles.paragraph, { color: colors.dark_blue }]}
//                   selectTextOnFocus
//                   maxLength={3}
//                   onChangeText={(text) => {
//                     const filtered = text.replace(/[^0-9]/g, '');
//                     setTotalBoxes(filtered);
//                     if (totalBoxesError) setTotalBoxesError('');
//                   }}
//                   onBlur={() => {
//                     let num = Number(totalBoxes);
//                     if (!totalBoxes || isNaN(num)) {
//                       setTotalBoxes('1');
//                       setTotalBoxesError('Must enter a number between 1 and 100');
//                     } else if (num < 1) {
//                       setTotalBoxes('1');
//                       setTotalBoxesError('Minimum value is 1');
//                     } else if (num > 100) {
//                       setTotalBoxes('100');
//                       setTotalBoxesError('Maximum value is 100');
//                     } else {
//                       setTotalBoxes(String(num));
//                       setTotalBoxesError('');
//                     }
//                   }}
//                 />
//               </View>
//               <BlessedBox width={40} height={40}></BlessedBox>
//             </View>
//           </View>

//           {/* Enable Shoebox Controller */}
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
//             <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Enable Shoebox Label</Text>
//           </View>

//           {/* ScrollView of Box Labels */}
//           <ScrollView
//             ref={scrollRef}
//             style={{ paddingHorizontal: 16, paddingBottom: 16, flexGrow: 0 }}
//             contentContainerStyle={{ gap: 16 }}
//             keyboardShouldPersistTaps="always"
//             keyboardDismissMode="on-drag">
//             {boxLabels.map((id) => (
//               <BoxLabel
//                 key={id}
//                 ref={(r) => {
//                   boxRefs.current[id] = r;
//                 }}
//                 onDelete={() => handleDeleteBoxLabel(id)}
//                 error={boxErrors[id]}
//               />
//             ))}
//           </ScrollView>

//           {/* Add BoxLabel Button */}
//           <View
//             style={{
//               alignSelf: 'center',
//               width: 36,
//               height: 36,
//               backgroundColor: colors.white,
//               borderRadius: 18,
//               justifyContent: 'center',
//               alignItems: 'center',
//               opacity: boxLabels.length >= 6 ? 0.4 : 1,
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: 3 },
//               shadowOpacity: 0.22,
//               shadowRadius: 3,
//               elevation: 3,
//             }}>
//             <PlusSign width={28} height={28} onPress={boxLabels.length >= 6 ? undefined : handleAddBoxLabel} />
//           </View>

//           {/* Continue Button */}
//           <View style={{ marginTop: 'auto', paddingHorizontal: 16, paddingBottom: 16 }}>
//             <TouchableOpacity style={[commonStyles.button]} onPress={handleContinue}>
//               <Text style={[commonStyles.header, { color: colors.white }]}>Continue</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { BoxLabelInfo } from '../types/BoxLabelInfo';
import { UNLABELED_GENDER_ID } from '../helpers/constants';

/**
 * ============================================================
 * AGE IDs
 * ============================================================
 */

const AGE_2_4_ID = 1;
const AGE_5_9_ID = 2;
const AGE_10_14_ID = 3;

/**
 * ============================================================
 * GENDER IDs
 * ============================================================
 */

const GIRL_GENDER_ID = 1;
const BOY_GENDER_ID = 2;

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

type Gender = 'girl' | 'boy' | 'unlabeled';
type AgeIndex = 0 | 1 | 2;

type BoxKey = `${Gender}-${AgeIndex}`;

type BoxValues = {
  [key in BoxKey]: number;
};

type GenderConfig = {
  key: Gender;
  emoji: string;
  label: string;
  title: string;
  text: string;
  border: string;
  selectedBg: string;
  plusBg: string;
  amountBg: string;
  amountBorder: string;
  amountText: string;
};

/**
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

const GENDERS: GenderConfig[] = [
  {
    key: 'girl',
    emoji: '👧',
    label: 'GIRL',
    title: 'Girl',
    text: '#ff9aaa',
    border: '#a5224c',
    selectedBg: '#3b1f2b',
    plusBg: '#e53e3e',
    amountBg: '#3a2430',
    amountBorder: '#5a2b3b',
    amountText: '#ff7a88',
  },
  {
    key: 'boy',
    emoji: '👦',
    label: 'BOY',
    title: 'Boy',
    text: '#75c9ff',
    border: '#07517d',
    selectedBg: '#172c48',
    plusBg: '#2d6cb5',
    amountBg: '#1b2b45',
    amountBorder: '#28426a',
    amountText: '#7ab8ea',
  },
  {
    key: 'unlabeled',
    emoji: '🎁',
    label: 'UNLABELED',
    title: 'Unlabeled',
    text: '#b8a0ff',
    border: '#5120a6',
    selectedBg: '#242044',
    plusBg: '#7046c7',
    amountBg: '#25234b',
    amountBorder: '#3e3476',
    amountText: '#b8a0ff',
  },
];

const initialValues: BoxValues = {
  'girl-0': 0,
  'girl-1': 0,
  'girl-2': 0,

  'boy-0': 0,
  'boy-1': 0,
  'boy-2': 0,

  'unlabeled-0': 0,
  'unlabeled-1': 0,
  'unlabeled-2': 0,
};

const ageLabels = ['2–4', '5–9', '10–14'];

const ageIds = [AGE_2_4_ID, AGE_5_9_ID, AGE_10_14_ID];

// Hex alpha appended to a 7-char hex color (e.g. '#a5224c' + '66')
const DIM_ALPHA = 'B3';

/**
 * ============================================================
 * MAIN SCREEN
 * ============================================================
 */

export default function Index() {
  /**
   * ==========================================================
   * RESPONSIVE DIMENSIONS
   * ==========================================================
   */

  const { width, height } = useWindowDimensions();

  const isVerySmallScreen = height < 700;
  const isSmallScreen = height < 780;

  const horizontalPadding = width < 380 ? 16 : 24;

  const headerHeight = isVerySmallScreen ? 58 : isSmallScreen ? 66 : 74;

  const headerButtonSize = isVerySmallScreen ? 40 : isSmallScreen ? 44 : 48;

  const titleFontSize = isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22;

  const totalCardMinHeight = isVerySmallScreen ? 64 : 76;

  const totalNumberSize = isVerySmallScreen ? 32 : isSmallScreen ? 36 : 40;

  const cellGap = 8;

  // Square cells: the width depends on the screen
  const cellSize = (width - horizontalPadding * 2 - cellGap * 3) / 4;

  const cellHeight = Math.min(cellSize, isVerySmallScreen ? 68 : 100);

  const rowGap = isVerySmallScreen ? 7 : isSmallScreen ? 9 : 12;

  const ageHeaderMarginTop = isVerySmallScreen ? 10 : isSmallScreen ? 14 : 22;

  const ageHeaderMarginBottom = isVerySmallScreen ? 5 : isSmallScreen ? 7 : 10;

  const controllerMarginTop = isVerySmallScreen ? 10 : isSmallScreen ? 14 : 20;

  const controllerPadding = 12;

  const controllerHeight = isVerySmallScreen ? 98 : 108;

  const continueHeight = isVerySmallScreen ? 52 : isSmallScreen ? 58 : 66;

  /**
   * ==========================================================
   * COLORS
   * ==========================================================
   */

  const screenBackground = '#101725';
  const cardBackground = '#192231';

  /**
   * ==========================================================
   * STATE
   * ==========================================================
   */

  const [values, setValues] = useState<BoxValues>(initialValues);

  // null = nothing selected (empty initial state)
  const [selectedBox, setSelectedBox] = useState<BoxKey | null>(null);

  const [modal, setModal] = useState(false);

  const [unlabeledAmount, setUnlabeled] = useState(0);

  const [mergedBoxData, setMergedBoxData] = useState<BoxLabelInfo[] | null>(null);

  /**
   * ==========================================================
   * TOTALS
   * ==========================================================
   */

  const totalBoxes = useMemo(() => {
    return Object.values(values).reduce((sum, value) => sum + value, 0);
  }, [values]);

  const girlTotal = values['girl-0'] + values['girl-1'] + values['girl-2'];
  const boyTotal = values['boy-0'] + values['boy-1'] + values['boy-2'];
  const unlabeledTotal = values['unlabeled-0'] + values['unlabeled-1'] + values['unlabeled-2'];

  const isEmpty = totalBoxes === 0;

  /**
   * ==========================================================
   * SELECTED BOX
   * ==========================================================
   */

  const selectedGenderKey = selectedBox ? (selectedBox.split('-')[0] as Gender) : null;

  const selectedAgeIndex = selectedBox ? (Number(selectedBox.split('-')[1]) as AgeIndex) : null;

  const selectedConfig = GENDERS.find((g) => g.key === selectedGenderKey) ?? null;

  const selectedValue = selectedBox ? values[selectedBox] : 0;

  /**
   * ==========================================================
   * UPDATE SELECTED BOX
   * ==========================================================
   */

  const updateSelectedBox = (amount: number) => {
    if (!selectedBox) return;

    setValues((prev) => ({
      ...prev,
      [selectedBox]: Math.max(0, prev[selectedBox] + amount),
    }));
  };

  /**
   * ==========================================================
   * BOX PRESS
   *
   * Selects the cell and adds +1.
   * ==========================================================
   */

  const handleBoxPress = (key: BoxKey) => {
    setSelectedBox(key);

    setValues((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  /**
   * ==========================================================
   * RESET
   * ==========================================================
   */

  const handleReset = () => {
    setValues(initialValues);
    setSelectedBox(null);
  };

  /**
   * ==========================================================
   * CREATE BoxLabelInfo[]
   * ==========================================================
   */

  const createBoxData = (): BoxLabelInfo[] => {
    const result: BoxLabelInfo[] = [];

    GENDERS.forEach(({ key: gender }) => {
      ageIds.forEach((ageId, ageIndex) => {
        const key = `${gender}-${ageIndex}` as BoxKey;

        const quantity = values[key];

        if (quantity <= 0) return;

        result.push({
          boxAgeId: ageId,
          genderId:
            gender === 'unlabeled'
              ? UNLABELED_GENDER_ID
              : gender === 'girl'
                ? GIRL_GENDER_ID
                : BOY_GENDER_ID,
          quantity,
        });
      });
    });

    return result;
  };

  /**
   * ==========================================================
   * CONTINUE
   * ==========================================================
   */

  const handleContinue = () => {
    if (totalBoxes < 1 || totalBoxes > 100) {
      Alert.alert('Error', 'The total number of boxes must be between 1 and 100.');

      return;
    }

    const boxData = createBoxData();

    setMergedBoxData(boxData);

    router.push({
      pathname: '/orders/orderSummary',
      params: {
        boxLabels: JSON.stringify(boxData),
      },
    });
  };

  /**
   * ==========================================================
   * SCREEN
   * ==========================================================
   */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: screenBackground,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: screenBackground,
        }}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <View
          style={{
            height: headerHeight,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: horizontalPadding,
          }}>
          {/* BACK */}

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: headerButtonSize,
              height: headerButtonSize,
              borderRadius: headerButtonSize / 2,
              backgroundColor: '#252d3c',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="chevron-left" size={isVerySmallScreen ? 22 : 26} color="#ffffff" />
          </TouchableOpacity>

          {/* TITLE */}

          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: titleFontSize,
                fontWeight: '700',
              }}>
              Enter Order
            </Text>
          </View>

          {/* RESET */}

          <TouchableOpacity
            onPress={handleReset}
            style={{
              width: headerButtonSize,
              height: headerButtonSize,
              borderRadius: headerButtonSize / 2,
              backgroundColor: '#252d3c',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="rotate-ccw" size={isVerySmallScreen ? 18 : 20} color="#aeb5c0" />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <View
          style={{
            flex: 1,
            paddingHorizontal: horizontalPadding,
          }}>
          {/* ==================================================
              TOTAL BOXES CARD
          ================================================== */}

          <View
            style={{
              minHeight: totalCardMinHeight,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: '#147b38',
              paddingHorizontal: isSmallScreen ? 18 : 24,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {/* TOTAL */}

            <View>
              <Text
                style={{
                  color: '#8fd0a4',
                  fontSize: isVerySmallScreen ? 12 : 14,
                  fontWeight: '700',
                  letterSpacing: 1.2,
                }}>
                TOTAL BOXES
              </Text>

              <Text
                style={{
                  color: '#ffffff',
                  fontSize: totalNumberSize,
                  lineHeight: totalNumberSize + 5,
                  fontWeight: '700',
                  marginTop: 1,
                }}>
                {totalBoxes}
              </Text>
            </View>

            {/* SUMMARY (or empty message) */}

            {isEmpty ? (
              <Text
                style={{
                  color: '#52b174',
                  fontSize: isVerySmallScreen ? 13 : 15,
                  fontWeight: '400',
                }}>
                No boxes yet
              </Text>
            ) : (
              <View
                style={{
                  gap: isVerySmallScreen ? 2 : 5,
                  alignItems: 'flex-start',
                }}>
                {[
                  { emoji: '👧', total: girlTotal },
                  { emoji: '👦', total: boyTotal },
                  { emoji: '🎁', total: unlabeledTotal },
                ]
                  .filter((item) => item.total > 0)
                  .map((item) => (
                    <Text
                      key={item.emoji}
                      style={{
                        color: '#ffffff',
                        fontSize: isVerySmallScreen ? 14 : 16,
                        fontWeight: '600',
                      }}>
                      {item.emoji} {item.total}
                    </Text>
                  ))}
              </View>
            )}
          </View>

          {/* ==================================================
              AGE HEADERS
          ================================================== */}

          <View
            style={{
              flexDirection: 'row',
              gap: cellGap,
              marginTop: ageHeaderMarginTop,
              marginBottom: ageHeaderMarginBottom,
            }}>
            <View
              style={{
                flex: 1,
              }}
            />

            {ageLabels.map((age) => (
              <View
                key={age}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#777f90',
                    fontSize: isVerySmallScreen ? 12 : 14,
                    fontWeight: '700',
                  }}>
                  {age}
                </Text>

                <Text
                  style={{
                    color: '#555d6c',
                    fontSize: isVerySmallScreen ? 9 : 11,
                    marginTop: 2,
                  }}>
                  yrs
                </Text>
              </View>
            ))}
          </View>

          {/* ==================================================
              GENDER ROWS (girl / boy / unlabeled)
          ================================================== */}

          {GENDERS.map((g, rowIndex) => (
            <View
              key={g.key}
              style={{
                flexDirection: 'row',
                gap: cellGap,
                marginBottom: rowIndex < GENDERS.length - 1 ? rowGap : 0,
              }}>
              <GenderCell config={g} cellHeight={cellHeight} />

              {([0, 1, 2] as AgeIndex[]).map((ageIndex) => {
                const key = `${g.key}-${ageIndex}` as BoxKey;

                return (
                  <NumberCell
                    key={key}
                    value={values[key]}
                    selected={selectedBox === key}
                    config={g}
                    cellHeight={cellHeight}
                    onPress={() => handleBoxPress(key)}
                  />
                );
              })}
            </View>
          ))}

          {/* Spacer: empuja el controlador y Continue hacia abajo */}

          <View style={{ flex: 1, minHeight: controllerMarginTop }} />

          {/* ==================================================
              SELECTED BOX CONTROLLER
          ================================================== */}

          <View
            style={{
              height: selectedConfig ? controllerHeight : continueHeight,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor: '#2b3545',
              padding: controllerPadding,
              justifyContent: 'center',
            }}>
            {selectedConfig && selectedAgeIndex !== null ? (
              <>
                {/* TOP CONTROLLER */}

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {/* SELECTED LABEL */}

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      flex: 1,
                      color: selectedConfig.text,
                      fontSize: isVerySmallScreen ? 13 : isSmallScreen ? 15 : 18,
                      fontWeight: '700',
                      marginRight: 8,
                    }}>
                    {selectedConfig.emoji} {selectedConfig.title} · {ageLabels[selectedAgeIndex]}{' '}
                    yrs
                  </Text>

                  {/* MINUS */}

                  <TouchableOpacity
                    onPress={() => updateSelectedBox(-1)}
                    style={{
                      width: isVerySmallScreen ? 30 : 34,
                      height: isVerySmallScreen ? 30 : 34,
                      borderRadius: isVerySmallScreen ? 15 : 17,
                      backgroundColor: '#293242',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <PlusMinusIcon
                      type="minus"
                      color="#929aaa"
                      size={isVerySmallScreen ? 12 : 14}
                    />
                  </TouchableOpacity>

                  {/* SELECTED VALUE */}

                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: isVerySmallScreen ? 19 : 22,
                      fontWeight: '700',
                      width: isVerySmallScreen ? 42 : 52,
                      textAlign: 'center',
                    }}>
                    {selectedValue}
                  </Text>

                  {/* PLUS */}

                  <TouchableOpacity
                    onPress={() => updateSelectedBox(1)}
                    style={{
                      width: isVerySmallScreen ? 30 : 34,
                      height: isVerySmallScreen ? 30 : 34,
                      borderRadius: isVerySmallScreen ? 15 : 17,
                      backgroundColor: selectedConfig.plusBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <PlusMinusIcon type="plus" color="#ffffff" size={isVerySmallScreen ? 12 : 14} />
                  </TouchableOpacity>
                </View>

                {/* ==================================================
                    +5 / +10 / +20
                ================================================== */}

                <View
                  style={{
                    flexDirection: 'row',
                    gap: isVerySmallScreen ? 8 : 10,
                    marginTop: isVerySmallScreen ? 6 : 10,
                  }}>
                  {[5, 10, 20].map((amount) => (
                    <AmountButton
                      key={amount}
                      amount={amount}
                      config={selectedConfig}
                      small={isVerySmallScreen}
                      onPress={() => updateSelectedBox(amount)}
                    />
                  ))}
                </View>
              </>
            ) : (
              <Text
                style={{
                  color: '#5a6272',
                  fontSize: isVerySmallScreen ? 14 : 16,
                  textAlign: 'center',
                }}>
                Tap a cell to select it
              </Text>
            )}
          </View>

          {/* ==================================================
              CONTINUE
          ================================================== */}

          <TouchableOpacity
            onPress={handleContinue}
            disabled={isEmpty}
            activeOpacity={0.8}
            style={{
              height: continueHeight,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: isEmpty ? '#1c2433' : '#18a346',
              shadowColor: '#18a346',
              shadowOpacity: isEmpty ? 0 : 0.45,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 6 },
              elevation: isEmpty ? 0 : 8,
              marginTop: isVerySmallScreen ? 8 : 12,
              // iOS already adds the safe area (home indicator); web/Android need more margin
              marginBottom: Platform.OS === 'ios' ? 12 : 28,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                color: isEmpty ? '#4a5263' : '#ffffff',
                fontSize: isVerySmallScreen ? 18 : 20,
                fontWeight: '800',
              }}>
              Continue
            </Text>

            {!isEmpty && (
              <View
                style={{
                  minWidth: isVerySmallScreen ? 28 : 32,
                  height: isVerySmallScreen ? 28 : 32,
                  paddingHorizontal: 7,
                  borderRadius: isVerySmallScreen ? 14 : 16,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: isVerySmallScreen ? 14 : 16,
                    fontWeight: '800',
                  }}>
                  {totalBoxes}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ====================================================
            MODAL
        ==================================================== */}

        <Modal
          visible={modal}
          transparent
          animationType="fade"
          onRequestClose={() => setModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.55)',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                width: '100%',
                maxWidth: 400,
                borderRadius: 20,
                backgroundColor: cardBackground,
                padding: 28,
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 18,
                  textAlign: 'center',
                  marginBottom: 24,
                }}>
                You have {unlabeledAmount} remaining unlabeled boxes. Do you wish to continue?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 14,
                }}>
                {/* CANCEL */}

                <TouchableOpacity
                  onPress={() => {
                    setUnlabeled(0);
                    setModal(false);
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#777f90',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                {/* CONTINUE */}

                <TouchableOpacity
                  onPress={() => {
                    const updated = [
                      ...(mergedBoxData ?? []),
                      {
                        boxAgeId: TWO_TO_FOUR_YEARS_ID,
                        genderId: UNLABELED_GENDER_ID,
                        quantity: unlabeledAmount,
                      },
                    ];

                    setMergedBoxData(updated as BoxLabelInfo[]);

                    setModal(false);

                    router.push({
                      pathname: '/orders/orderSummary',
                      params: {
                        boxLabels: JSON.stringify(updated),
                      },
                    });
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#18a346',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

/**
 * ============================================================
 * PLUS / MINUS ICON
 *
 * Drawn with Views so it is perfectly centered
 * (the text glyphs − and + get misaligned depending on the font).
 * ============================================================
 */

function PlusMinusIcon({
  type,
  color,
  size,
}: {
  type: 'plus' | 'minus';
  color: string;
  size: number;
}) {
  const thickness = 2.5;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: thickness,
          borderRadius: thickness / 2,
          backgroundColor: color,
        }}
      />

      {type === 'plus' && (
        <View
          style={{
            position: 'absolute',
            width: thickness,
            height: size,
            borderRadius: thickness / 2,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
}

/**
 * ============================================================
 * GENDER CELL
 * ============================================================
 */

function GenderCell({ config, cellHeight }: { config: GenderConfig; cellHeight: number }) {
  const isSmall = cellHeight < 90;

  return (
    <View
      style={{
        flex: 1,
        height: cellHeight,
        borderRadius: isSmall ? 15 : 20,
        borderWidth: 1,
        borderColor: config.border + DIM_ALPHA,
        backgroundColor: '#192231',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: isSmall ? 22 : 28,
        }}>
        {config.emoji}
      </Text>

      <Text
        style={{
          color: config.text,
          fontSize: isSmall ? 9 : 12,
          fontWeight: '800',
          marginTop: 2,
        }}>
        {config.label}
      </Text>
    </View>
  );
}

/**
 * ============================================================
 * NUMBER CELL
 * ============================================================
 */

function NumberCell({
  value,
  selected,
  config,
  onPress,
  cellHeight,
}: {
  value: number;
  selected: boolean;
  config: GenderConfig;
  onPress: () => void;
  cellHeight: number;
}) {
  const isSmall = cellHeight < 90;

  // Dim border when the cell is 0 and not selected
  const dim = value === 0 && !selected;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flex: 1,
        height: cellHeight,
        borderRadius: isSmall ? 15 : 20,
        borderWidth: selected ? 2 : 1,
        borderColor: dim ? config.border + DIM_ALPHA : config.border,
        backgroundColor: selected ? config.selectedBg : '#192231',
        transform: [{ scale: selected ? 1.04 : 1 }],
        shadowColor: config.border,
        shadowOpacity: selected ? 0.6 : 0,
        shadowRadius: selected ? 10 : 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: selected ? 6 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: config.text,
          fontSize: isSmall ? 29 : 38,
          fontWeight: '600',
        }}>
        {value}
      </Text>

      {value === 0 && (
        <Text
          style={{
            color: '#4f5869',
            fontSize: isSmall ? 8 : 11,
            marginTop: -3,
          }}>
          tap
        </Text>
      )}
    </TouchableOpacity>
  );
}

/**
 * ============================================================
 * +5 / +10 / +20 BUTTON
 * ============================================================
 */

function AmountButton({
  amount,
  config,
  onPress,
  small,
}: {
  amount: number;
  config: GenderConfig;
  onPress: () => void;
  small: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex: 1,
        height: small ? 30 : 34,
        borderRadius: small ? 10 : 12,
        backgroundColor: config.amountBg,
        borderWidth: 1,
        borderColor: config.amountBorder,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: config.amountText,
          fontSize: small ? 12 : 15,
          fontWeight: '800',
        }}>
        +{amount}
      </Text>
    </TouchableOpacity>
  );
}
