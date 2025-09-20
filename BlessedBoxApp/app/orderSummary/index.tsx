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

export default function Index() {
  const { boxLabels } = useLocalSearchParams<{ boxLabels: string }>();
  let parsedBoxLabels: BoxLabelInfo[] = [];
  if (boxLabels) {
    parsedBoxLabels = JSON.parse(boxLabels) as BoxLabelInfo[];
  }
  const handleBackPress = () => {
    return router.back();
  };
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
          <GenderInitial genderCode={boxLabel.gender} />
          <View style={{ borderRadius: 5, width: 'auto', maxWidth: 60, backgroundColor: colors.light_gray, alignItems: 'center', justifyContent: 'center', flex: 1, padding: 2 }}>
            <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>{boxLabel.selectedAge}</Text>
          </View>
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
          {/* Empty Container */}
          <View style={{ width: 25 }}></View>
        </View>

        {/* Content */}
        <View style={[commonStyles.card, {}]}>
          {/* Church Container */}
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, borderBottomWidth: 1, borderColor: colors.light_gray }}>
            <Text>{`${'Image'}`}</Text>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Text style={commonStyles.header}>Church</Text>
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>Iglesia Cristiana Bethlehem</Text>
            </View>
          </View>
          {/* Order Summary */}
          {appendOrderSummary()}
        </View>
        {/* Continue Button */}
        <View style={{ marginTop: 'auto' }}>
          <TouchableOpacity style={[commonStyles.button]} onPress={() => {}}>
            <Text style={[commonStyles.header, { color: colors.white }]}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
