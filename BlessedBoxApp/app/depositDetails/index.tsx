import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../baseStyles/colors';

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'information' | 'summary'>('information');
  const handleReturn = () => {
    return router.push('./order');
  };
  const handleTab = (value: string) => {
    setActiveTab(value === 'information' ? 'information' : 'summary');
  };
  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
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
          onPress={handleReturn}>{`${'Back'}`}</Text>
        <Text style={commonStyles.header}>Deposit Details</Text>
      </View>
      <SwitchSelector
        options={[
          { label: 'Deposit Information', value: 'information' },
          { label: 'Box Summary', value: 'summary' },
        ]}
        initial={0}
        onPress={handleTab}
        textColor={colors.dark_gray}
        selectedColor={colors.white}
        buttonColor={colors.dark_green}
        borderColor={colors.white}
        style={{
          width: '100%',
          height: 50,
          marginBottom: 20,
          padding: 20,
        }}
        textStyle={{
          fontFamily: commonStyles.paragraph.fontFamily,
        }}
        selectedTextStyle={{
          fontFamily: commonStyles.paragraphBold.fontFamily,
        }}></SwitchSelector>
      <View style={commonStyles.card}>
        {activeTab === 'information' ? (
          <Text>Contenido de Información del Depósito</Text>
        ) : (
          <Text>Contenido de Resumen de la Caja jjjjj</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
