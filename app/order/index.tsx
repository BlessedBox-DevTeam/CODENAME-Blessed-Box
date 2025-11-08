import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BoxLabel from '../components/boxLabel';

export default function Index() {
  const [maxManualWidth, setManualWidth] = useState<number | `${number}%`>(0);
  const handleBackPress = () => {
    return router.replace('./qrCode');
  };
  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 20,
            paddingBottom: 0,
            position: 'relative',
          }}>
          <Text
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              padding: 20,
            }}
            onPress={handleBackPress}>{`${'Back'}`}</Text>
          <Text style={commonStyles.header}>Enter Order</Text>
        </View>

        <View
          style={[
            commonStyles.card,
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              alignItems: 'center',
              margin: 16,
            },
          ]}>
          <Text
            style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
            Total Boxes
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.light_gray,
              paddingVertical: 3,
              paddingHorizontal: 10,
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}>
            <Text
              style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
              10
            </Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>★</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
            Enable Shoebox Label
          </Text>
          {/* <Slider></Slider> */}
        </View>
        <BoxLabel></BoxLabel>
        <View>
          <TouchableOpacity style={[commonStyles.button]} onPress={() => {}}>
            <Text style={[commonStyles.header, { color: colors.white }]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
