import { router, Stack } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';
import { useLocalSearchParams } from 'expo-router';
import { BoxLabelInfo } from '../types/BoxLabelInfo';
import GenderInitial from '../components/GenderInitial';
import BackArrow from '../components/icons/BackArrow';

/**
 * Order Summary Screen
 *
 * Displays the details of a user's order, including the total quantity of boxes,
 * their gender and age labels, and church information. Allows the user to go back
 * or confirm the order.
 *
 * @returns {JSX.Element} Order Summary screen component
 */
export default function Index() {
  /** Extract serialized boxLabels from query params */
  const { boxLabels } = useLocalSearchParams<{ boxLabels: string }>();

  /** Parse the boxLabels JSON string into an array of BoxLabelInfo */
  let parsedBoxLabels: BoxLabelInfo[] = [];
  if (boxLabels) {
    parsedBoxLabels = JSON.parse(boxLabels) as BoxLabelInfo[];
  }

  /**
   * Handle back button press
   * Navigates to the previous screen
   */
  const handleBackPress = () => {
    return router.back();
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
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{`${boxLabel.quantity}x`}</Text>
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Blessed Box</Text>
        </View>

        {/* Details Container */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {boxLabel.gender === false || boxLabel.selectedAge === false ? (
            <Text style={[commonStyles.paragraphItalic, { color: colors.dark_gray }]}>Unlabeled</Text>
          ) : (
            <>
              <GenderInitial genderCode={boxLabel.gender} />
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
                <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>{boxLabel.selectedAge}</Text>
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
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 0,
            marginBottom: 20,
          }}>
          <BackArrow onPress={handleBackPress} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Order Summary</Text>
          </View>
          {/* Empty Spacer */}
          <View style={{ width: 25 }}></View>
        </View>

        {/* Order Details Card */}
        <View style={[commonStyles.card, {}]}>
          {/* Church Info Container */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              borderBottomWidth: 1,
              borderColor: colors.light_gray,
            }}>
            <Text>{`${'Image'}`}</Text>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Text style={commonStyles.header}>Church</Text>
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>Iglesia Cristiana Bethlehem</Text>
            </View>
          </View>

          {/* Box Labels Summary */}
          {appendOrderSummary()}
        </View>

        {/* Confirm Order Button */}
        <View style={{ marginTop: 'auto' }}>
          <TouchableOpacity style={[commonStyles.button]} onPress={() => {}}>
            <Text style={[commonStyles.header, { color: colors.white }]}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
