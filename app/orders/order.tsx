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
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';
import BackArrow from '../components/icons/BackArrow';
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

/**
 * ============================================================
 * INITIAL VALUES
 * ============================================================
 */

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

  const totalCardHeight = isVerySmallScreen ? 100 : isSmallScreen ? 112 : 138;

  const totalNumberSize = isVerySmallScreen ? 34 : isSmallScreen ? 38 : 44;

  const cellHeight = isVerySmallScreen ? 68 : isSmallScreen ? 78 : 100;

  const rowGap = isVerySmallScreen ? 7 : isSmallScreen ? 9 : 12;

  const ageHeaderMarginTop = isVerySmallScreen ? 10 : isSmallScreen ? 14 : 22;

  const ageHeaderMarginBottom = isVerySmallScreen ? 5 : isSmallScreen ? 7 : 10;

  const controllerMarginTop = isVerySmallScreen ? 10 : isSmallScreen ? 14 : 20;

  const controllerPadding = isVerySmallScreen ? 10 : isSmallScreen ? 12 : 16;

  const controllerHeight = isVerySmallScreen ? 105 : isSmallScreen ? 112 : 126;

  const continueHeight = isVerySmallScreen ? 52 : isSmallScreen ? 58 : 66;

  /**
   * ==========================================================
   * COLORS
   * ==========================================================
   */

  const screenBackground = '#101725';
  const cardBackground = '#192231';

  const girlColor = '#ff9aaa';
  const boyColor = '#75c9ff';
  const unlabeledColor = '#b8a0ff';

  /**
   * ==========================================================
   * STATE
   * ==========================================================
   */

  const [values, setValues] = useState<BoxValues>(initialValues);

  const [selectedBox, setSelectedBox] = useState<BoxKey>('unlabeled-1');

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

  const girlTotal = useMemo(() => {
    return values['girl-0'] + values['girl-1'] + values['girl-2'];
  }, [values]);

  const boyTotal = useMemo(() => {
    return values['boy-0'] + values['boy-1'] + values['boy-2'];
  }, [values]);

  const unlabeledTotal = useMemo(() => {
    return values['unlabeled-0'] + values['unlabeled-1'] + values['unlabeled-2'];
  }, [values]);

  /**
   * ==========================================================
   * SELECTED BOX
   * ==========================================================
   */

  const selectedValue = values[selectedBox];

  const selectedGender = selectedBox.split('-')[0] as Gender;

  const selectedAgeIndex = Number(selectedBox.split('-')[1]) as AgeIndex;

  const selectedAge = ageLabels[selectedAgeIndex];

  const selectedGenderLabel =
    selectedGender === 'girl' ? 'Girl' : selectedGender === 'boy' ? 'Boy' : 'Unlabeled';

  const selectedEmoji = selectedGender === 'girl' ? '👧' : selectedGender === 'boy' ? '👦' : '🎁';

  /**
   * ==========================================================
   * UPDATE SELECTED BOX
   * ==========================================================
   */

  const updateSelectedBox = (amount: number) => {
    setValues((prev) => ({
      ...prev,
      [selectedBox]: Math.max(0, prev[selectedBox] + amount),
    }));
  };

  /**
   * ==========================================================
   * BOX PRESS
   *
   * Selecciona el cuadro y suma +1.
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
    setSelectedBox('unlabeled-1');
  };

  /**
   * ==========================================================
   * CREATE BoxLabelInfo[]
   * ==========================================================
   */

  const createBoxData = (): BoxLabelInfo[] => {
    const result: BoxLabelInfo[] = [];

    const genders: Gender[] = ['girl', 'boy', 'unlabeled'];

    genders.forEach((gender) => {
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
    if (!totalBoxes || totalBoxes < 1 || totalBoxes > 100) {
      Alert.alert('Error', 'The total number of boxes must be between 1 and 100.');

      return;
    }

    const boxData = createBoxData();

    setMergedBoxData(boxData);

    console.log(boxData);

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
            <BackArrow />
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
            <Text
              style={{
                color: '#aeb5c0',
                fontSize: isVerySmallScreen ? 21 : 24,
              }}>
              ↶
            </Text>
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
              height: totalCardHeight,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: '#147b38',
              paddingHorizontal: isSmallScreen ? 18 : 24,
              paddingVertical: isSmallScreen ? 10 : 18,
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

            {/* SUMMARY */}

            <View
              style={{
                gap: isVerySmallScreen ? 2 : 5,
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: isVerySmallScreen ? 14 : 16,
                  fontWeight: '600',
                }}>
                👧 {girlTotal}
              </Text>

              <Text
                style={{
                  color: '#ffffff',
                  fontSize: isVerySmallScreen ? 14 : 16,
                  fontWeight: '600',
                }}>
                👦 {boyTotal}
              </Text>

              <Text
                style={{
                  color: '#ffffff',
                  fontSize: isVerySmallScreen ? 14 : 16,
                  fontWeight: '600',
                }}>
                🎁 {unlabeledTotal}
              </Text>
            </View>
          </View>

          {/* ==================================================
              AGE HEADERS
          ================================================== */}

          <View
            style={{
              flexDirection: 'row',
              marginTop: ageHeaderMarginTop,
              marginBottom: ageHeaderMarginBottom,
            }}>
            <View
              style={{
                flex: 1,
                marginRight: 8,
              }}
            />

            {ageLabels.map((age) => (
              <View
                key={age}
                style={{
                  flex: 1,
                  marginRight: 8,
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
              GIRL ROW
          ================================================== */}

          <View
            style={{
              flexDirection: 'row',
              marginBottom: rowGap,
            }}>
            <GenderCell gender="girl" emoji="👧" label="GIRL" cellHeight={cellHeight} />

            {[0, 1, 2].map((ageIndex) => {
              const key = `girl-${ageIndex}` as BoxKey;

              return (
                <NumberCell
                  key={key}
                  value={values[key]}
                  selected={selectedBox === key}
                  gender="girl"
                  cellHeight={cellHeight}
                  onPress={() => handleBoxPress(key)}
                />
              );
            })}
          </View>

          {/* ==================================================
              BOY ROW
          ================================================== */}

          <View
            style={{
              flexDirection: 'row',
              marginBottom: rowGap,
            }}>
            <GenderCell gender="boy" emoji="👦" label="BOY" cellHeight={cellHeight} />

            {[0, 1, 2].map((ageIndex) => {
              const key = `boy-${ageIndex}` as BoxKey;

              return (
                <NumberCell
                  key={key}
                  value={values[key]}
                  selected={selectedBox === key}
                  gender="boy"
                  cellHeight={cellHeight}
                  onPress={() => handleBoxPress(key)}
                />
              );
            })}
          </View>

          {/* ==================================================
              UNLABELED ROW
          ================================================== */}

          <View
            style={{
              flexDirection: 'row',
            }}>
            <GenderCell gender="unlabeled" emoji="🎁" label="UNLABELED" cellHeight={cellHeight} />

            {[0, 1, 2].map((ageIndex) => {
              const key = `unlabeled-${ageIndex}` as BoxKey;

              return (
                <NumberCell
                  key={key}
                  value={values[key]}
                  selected={selectedBox === key}
                  gender="unlabeled"
                  cellHeight={cellHeight}
                  onPress={() => handleBoxPress(key)}
                />
              );
            })}
          </View>

          {/* ==================================================
              SELECTED BOX CONTROLLER
          ================================================== */}

          <View
            style={{
              height: controllerHeight,
              marginTop: controllerMarginTop,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor: '#2b3545',
              padding: controllerPadding,
            }}>
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
                  color:
                    selectedGender === 'girl'
                      ? girlColor
                      : selectedGender === 'boy'
                        ? boyColor
                        : unlabeledColor,
                  fontSize: isVerySmallScreen ? 13 : isSmallScreen ? 15 : 18,
                  fontWeight: '700',
                  marginRight: 8,
                }}>
                {selectedEmoji} {selectedGenderLabel} · {selectedAge} yrs
              </Text>

              {/* MINUS */}

              <TouchableOpacity
                onPress={() => updateSelectedBox(-1)}
                style={{
                  width: isVerySmallScreen ? 34 : 40,
                  height: isVerySmallScreen ? 34 : 40,
                  borderRadius: isVerySmallScreen ? 17 : 20,
                  backgroundColor: '#293242',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#929aaa',
                    fontSize: isVerySmallScreen ? 20 : 23,
                  }}>
                  −
                </Text>
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
                  width: isVerySmallScreen ? 34 : 40,
                  height: isVerySmallScreen ? 34 : 40,
                  borderRadius: isVerySmallScreen ? 17 : 20,
                  backgroundColor: '#7046c7',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: isVerySmallScreen ? 22 : 25,
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            {/* ==================================================
                +5 / +10 / +20
            ================================================== */}

            <View
              style={{
                flexDirection: 'row',
                gap: isVerySmallScreen ? 8 : 10,
              }}>
              <AmountButton
                amount={5}
                small={isVerySmallScreen}
                onPress={() => updateSelectedBox(5)}
              />

              <AmountButton
                amount={10}
                small={isVerySmallScreen}
                onPress={() => updateSelectedBox(10)}
              />

              <AmountButton
                amount={20}
                small={isVerySmallScreen}
                onPress={() => updateSelectedBox(20)}
              />
            </View>
          </View>

          {/* ==================================================
              CONTINUE
          ================================================== */}

          <TouchableOpacity
            onPress={handleContinue}
            style={{
              height: continueHeight,
              borderRadius: isSmallScreen ? 18 : 22,
              backgroundColor: '#18a346',
              marginTop: isVerySmallScreen ? 8 : 12,
              marginBottom: 8,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: isVerySmallScreen ? 18 : 20,
                fontWeight: '800',
              }}>
              Continue
            </Text>

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
                        boxAgeId: false,
                        genderId: UNLABELED_GENDER_ID,
                        quantity: unlabeledAmount,
                      },
                    ];

                    setMergedBoxData(updated);

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
 * GENDER CELL
 * ============================================================
 */

function GenderCell({
  gender,
  emoji,
  label,
  cellHeight,
}: {
  gender: Gender;
  emoji: string;
  label: string;
  cellHeight: number;
}) {
  const borderColor = gender === 'girl' ? '#a5224c' : gender === 'boy' ? '#07517d' : '#5120a6';

  const textColor = gender === 'girl' ? '#ff9aaa' : gender === 'boy' ? '#75c9ff' : '#b8a0ff';

  const isSmall = cellHeight < 90;

  return (
    <View
      style={{
        flex: 1,
        height: cellHeight,
        marginRight: 8,
        borderRadius: isSmall ? 15 : 20,
        borderWidth: 1,
        borderColor,
        backgroundColor: '#192231',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: isSmall ? 22 : 28,
        }}>
        {emoji}
      </Text>

      <Text
        style={{
          color: textColor,
          fontSize: isSmall ? 9 : 12,
          fontWeight: '800',
          marginTop: 2,
        }}>
        {label}
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
  gender,
  onPress,
  cellHeight,
}: {
  value: number;
  selected: boolean;
  gender: Gender;
  onPress: () => void;
  cellHeight: number;
}) {
  const color = gender === 'girl' ? '#ff9aaa' : gender === 'boy' ? '#75c9ff' : '#b8a0ff';

  const borderColor = gender === 'girl' ? '#a5224c' : gender === 'boy' ? '#07517d' : '#5120a6';

  const isSmall = cellHeight < 90;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flex: 1,
        height: cellHeight,
        marginRight: 8,
        borderRadius: isSmall ? 15 : 20,
        borderWidth: selected ? 2 : 1,
        borderColor,
        backgroundColor: selected && gender === 'unlabeled' ? '#242044' : '#192231',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color,
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
  onPress,
  small,
}: {
  amount: number;
  onPress: () => void;
  small: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex: 1,
        height: small ? 34 : 40,
        borderRadius: small ? 11 : 14,
        backgroundColor: '#25234b',
        borderWidth: 1,
        borderColor: '#3e3476',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: '#b8a0ff',
          fontSize: small ? 12 : 15,
          fontWeight: '800',
        }}>
        +{amount}
      </Text>
    </TouchableOpacity>
  );
}
