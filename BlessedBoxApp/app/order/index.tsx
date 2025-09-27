import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BoxLabel, { BoxLabelType } from '../components/BoxLabel';
import Arrow from '../components/icons/BackArrow';
import PlusSign from '../components/icons/PlusSign';
import { BoxLabelInfo } from '../types/BoxLabelInfo';

export default function Index() {
  const [boxLabels, setBoxLabels] = useState<number[]>([0]);
  const nextId = useRef(1);
  const [totalBoxes, setTotalBoxes] = useState('1');
  const scrollRef = useRef<ScrollView>(null);
  const boxRefs = useRef<{ [key: number]: BoxLabelType | null }>({});

  const handleAddBoxLabel = () => {
    setBoxLabels((prev) => {
      if (prev.length >= 6) return prev; // no agregamos más de 6
      return [...prev, nextId.current++];
    });
    setTimeout(() => {
      if (boxLabels.length < 6) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
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
    const mergedData: BoxLabelInfo[] = Array.from(
      allData.reduce((map, item) => {
        if (!item) return map; // por si hay undefined
        const key = `${item.selectedAge}-${item.gender ?? 'any'}`; // agrupamos por edad y género
        if (!map.has(key)) {
          map.set(key, { ...item }); // guardamos copia del objeto
        } else {
          map.get(key)!.quantity += item.quantity; // sumamos la cantidad
        }
        return map;
      }, new Map<string, BoxLabelInfo>())
    ).map(([_, value]) => value);
    router.push({
      pathname: './orderSummary',
      params: { boxLabels: JSON.stringify(mergedData) },
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
          <View
            style={{
              alignSelf: 'center',
              width: 36,
              height: 36,
              backgroundColor: colors.white,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: boxLabels.length >= 6 ? 0.4 : 1, // menos visible si llega a 6
              // sombra iOS
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.22,
              shadowRadius: 3,
              // sombra Android
              elevation: 3,
            }}>
            <PlusSign
              width={28}
              height={28}
              onPress={boxLabels.length >= 6 ? undefined : handleAddBoxLabel} // deshabilitado si llega a 6
            />
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
