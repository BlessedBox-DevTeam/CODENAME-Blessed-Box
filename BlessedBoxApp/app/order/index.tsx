import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BoxLabel from '../components/BoxLabel';

export default function Index() {
  // Just an array of BoxLabel placeholders
  const [boxLabels, setBoxLabels] = useState<number[]>([0]);

  // Add a new BoxLabel
  const handleAddBoxLabel = () => {
    setBoxLabels((prev) => [...prev, prev.length]);
  };

  // Remove a BoxLabel by its index
  const handleDeleteBoxLabel = (index: number) => {
    setBoxLabels((prev) => prev.filter((i) => i !== index));
  };
  const handleBackPress = () => {
    return router.replace('./qrCode');
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaProvider>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
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
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Total Boxes</Text>
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
              <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>10</Text>
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
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Enable Shoebox Label</Text>
            {/* <Slider></Slider> */}
          </View>
          {boxLabels.map((idx) => (
            <BoxLabel key={idx} onDelete={() => handleDeleteBoxLabel(idx)} />
          ))}
          <View>
            <TouchableOpacity
              style={[commonStyles.button]}
              onPress={() => {
                router.replace('./depositDetails');
              }}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}
