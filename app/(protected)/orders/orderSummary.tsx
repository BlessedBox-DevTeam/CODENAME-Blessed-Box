import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../baseStyles/colors';
import commonStyles from '../../baseStyles/baseStyles';
import { BoxLabelInfo, NewTransactionPayload } from '../../types/BoxLabelInfo';
import GenderInitial from '../../components/GenderInitial';
import BackArrow from '../../components/icons/BackArrow';
import Church from '../../components/icons/Church';
import LoadingOverlay from '../../components/LoadingSpinner';
import {
  BOX_AGE_MAP,
  FEMALE_GENDER_ID,
  MALE_GENDER_ID,
  UNLABELED_GENDER_ID,
} from '../../helpers/constants';
import { newTransaction } from '../../services/services';

/**
 * Order Summary Screen
 *
 * Displays the details of a user's drop-off, including the total quantity of boxes,
 * their gender and age labels, and church information. Allows the user to go back
 * or confirm the order.
 *
 * @returns {JSX.Element} Order Summary screen component
 */
export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  /** Extract serialized boxLabels from query params */
  const { boxLabels } = useLocalSearchParams<{ boxLabels: string }>();

  /** Parse the boxLabels JSON string into an array of BoxLabelInfo */
  let parsedBoxLabels: BoxLabelInfo[] = [];
  if (boxLabels) {
    parsedBoxLabels = JSON.parse(boxLabels) as BoxLabelInfo[];
  }

  const createTransactionPayload = (): NewTransactionPayload => {
    const payload: NewTransactionPayload = { boxLabels: {} };

    parsedBoxLabels.forEach(({ genderId, boxAgeId, quantity }) => {
      if (quantity <= 0) return;

      if (genderId === UNLABELED_GENDER_ID) {
        payload.boxLabels.Unlabeled ??= { quantity: 0 };
        payload.boxLabels.Unlabeled.quantity += quantity;
        return;
      }

      const age = BOX_AGE_MAP[boxAgeId];
      if (age !== '2-4' && age !== '5-9' && age !== '10-14') {
        throw new Error(`Unsupported box age ID: ${boxAgeId}`);
      }

      if (genderId === MALE_GENDER_ID) {
        payload.boxLabels.Male ??= {};
        payload.boxLabels.Male[age] = (payload.boxLabels.Male[age] ?? 0) + quantity;
      } else if (genderId === FEMALE_GENDER_ID) {
        payload.boxLabels.Female ??= {};
        payload.boxLabels.Female[age] = (payload.boxLabels.Female[age] ?? 0) + quantity;
      } else {
        throw new Error(`Unsupported gender ID: ${genderId}`);
      }
    });

    return payload;
  };

  /**
   * Handle back button press
   * Navigates to the previous screen
   */
  const handleBackPress = () => {
    return router.back();
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);

    try {
      const payload = createTransactionPayload();
      const { response, message } = (await newTransaction(payload)).data;

      if (!response) {
        Alert.alert('Error', message || 'Unable to confirm the drop-off.');
        return;
      }

      router.replace({
        pathname: '/orders/completedOrder',
        params: { transactionId: response.transactionId },
      });
    } catch (error) {
      console.error('Unable to confirm drop-off:', error);
      Alert.alert('Error', 'Unable to confirm the drop-off. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate the list of order summary rows
   *
   * @returns {JSX.Element[]} Array of JSX elements for each box label
   */
  const appendOrderSummary = () => {
    return parsedBoxLabels.map((boxLabel, index) => (
      <View
        key={index}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          borderColor: colors.light_gray,
          borderBottomWidth: index === parsedBoxLabels.length - 1 ? 0 : 1,
          overflow: 'hidden',
        }}>
        {/* Amount Container */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Text
            style={[
              commonStyles.paragraphBold,
              { color: colors.dark_blue },
            ]}>{`${boxLabel.quantity}x`}</Text>
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>BlessedBox</Text>
        </View>

        {/* Details Container */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {boxLabel.genderId === UNLABELED_GENDER_ID ? (
            <Text style={[commonStyles.paragraphItalic, { color: colors.dark_gray }]}>
              Unlabeled
            </Text>
          ) : (
            <>
              <GenderInitial genderCode={boxLabel.genderId} />
              <View
                style={{
                  borderRadius: 5,
                  width: 'auto',
                  maxWidth: 60,
                  backgroundColor: colors.light_gray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  padding: 2,
                }}>
                <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>
                  {BOX_AGE_MAP[boxLabel.boxAgeId]}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <LoadingOverlay visible={isLoading} />
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
          }}>
          <BackArrow onPress={handleBackPress} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Drop-off Summary</Text>
          </View>
          {/* Empty Spacer */}
          <View style={{ width: 44 }} />
        </View>
        {/* Main Content */}
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* Order Details Card */}
          <View style={[commonStyles.card, {}]}>
            {/* Church Info Container */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: colors.light_gray,
              }}>
              <Church width={30} height={30}></Church>
              <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Text style={commonStyles.header}>Church</Text>
                <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
                  Iglesia Cristiana Bethlehem
                </Text>
              </View>
            </View>

            {/* Box Labels Summary */}
            {appendOrderSummary()}
          </View>

          {/* Confirm Order Button */}
          <View style={{ marginTop: 'auto' }}>
            <TouchableOpacity style={[commonStyles.button]} onPress={handleConfirmOrder}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
