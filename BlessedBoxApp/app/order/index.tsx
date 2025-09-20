import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BoxLabel, { BoxLabelType } from '../components/BoxLabel';
import Arrow from '../components/icons/BackArrow';

export default function Index() {
  const [boxLabels, setBoxLabels] = useState<number[]>([0]);
  const nextId = useRef(1);
  const [totalBoxes, setTotalBoxes] = useState('1');
  const scrollRef = useRef<ScrollView>(null);
  const boxRefs = useRef<{ [key: number]: BoxLabelType | null }>({});

  const handleAddBoxLabel = () => {
    setBoxLabels((prev) => [...prev, nextId.current++]);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  const handleDeleteBoxLabel = (id: number) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBoxLabels((prev) => prev.filter((boxId) => boxId !== id));
  };
  const handleBackPress = () => {
    return router.replace('./qrCode');
  };
  const handleContinue = () => {
    const allData = boxLabels.map((id) => boxRefs.current[id]?.getData());
    router.push({
      pathname: './orderSummary',
      params: { boxLabels: JSON.stringify(allData) },
    });
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
          <Arrow onPress={handleBackPress} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Enter Order</Text>
          </View>
          {/* Empty Container */}
          <View style={{ width: 25 }}></View>
        </View>

        {/* Main Section Container */}
        <View style={{ display: 'flex', flex: 1, gap: 16 }}>
          {/* Total Boxes Card */}
          <View
            style={[
              commonStyles.card,
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 24,
                marginHorizontal: 16,
              },
            ]}>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Total Boxes</Text>
            {/* Text Input Container */}
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.light_gray,
                // paddingLeft: 12,
                // paddingRight: 12,
                padding: 5,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}>
              <TextInput
                value={totalBoxes}
                keyboardType="numeric"
                style={[commonStyles.paragraph, { color: colors.dark_blue }]}
                selectTextOnFocus={true}
                autoFocus={false}
                maxLength={3}
                onChangeText={(text) => {
                  // Only allow numbers
                  const filtered = text.replace(/[^0-9]/g, '');
                  setTotalBoxes(filtered);
                }}
                onBlur={() => {
                  let num = Number(totalBoxes);
                  if (!totalBoxes || isNaN(num)) {
                    setTotalBoxes('1');
                  } else if (num < 1) {
                    setTotalBoxes('1');
                  } else if (num > 100) {
                    setTotalBoxes('100');
                  } else {
                    setTotalBoxes(String(num));
                  }
                }}
              />
              <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>★</Text>
            </View>
          </View>

          {/* Enable Shoebox Controller */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>Enable Shoebox Label</Text>
            {/* <Slider></Slider> */}
          </View>

          {/* Scroll View Container */}
          <ScrollView
            ref={scrollRef}
            style={{ paddingHorizontal: 16, flexGrow: 0 }}
            contentContainerStyle={{ gap: 16 }}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag">
            {/* Render */}
            {boxLabels.map((id) => (
              <BoxLabel
                key={id}
                ref={(r) => {
                  boxRefs.current[id] = r;
                }}
                onDelete={() => handleDeleteBoxLabel(id)}
              />
            ))}
          </ScrollView>

          {/* Add button */}
          <Text
            style={[
              commonStyles.paragraphBold,
              {
                alignSelf: 'center',
                backgroundColor: colors.white,
                width: 'auto',
                borderRadius: 80,
                color: colors.dark_gray,
                fontSize: 32,
                paddingHorizontal: 10,
              },
            ]}
            onPress={handleAddBoxLabel}>
            +
          </Text>

          {/* Continue Button */}
          <View style={{ marginTop: 'auto' }}>
            <TouchableOpacity style={[commonStyles.button]} onPress={handleContinue}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
