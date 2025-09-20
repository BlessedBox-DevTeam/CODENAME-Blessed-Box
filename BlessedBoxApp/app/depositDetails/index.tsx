import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  const dummyData = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    transactionDate: 'November 10, 2025 - 3:00pm',
    orderNumber: 'Order #12345',
    churchText: 'Church',
    churchName: 'Iglesia Cristiana Bethlehem',
  };

  const appendDepositDetails = () => {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          paddingVertical: 10,
          borderColor: colors.light_gray,
          // borderBottomWidth: index === parsedBoxLabels.length - 1 ? 0 : 1,
          overflow: 'hidden',
        }}>
        {/* Name Container */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            borderBottomColor: colors.light_gray,
            borderBottomWidth: 2,
            paddingBottom: 10,
            marginBottom: 10,
          }}>
          {/* SVG */}
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{dummyData.fullName}</Text>
        </View>

        {/* Email Container */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            borderBottomColor: colors.light_gray,
            borderBottomWidth: 2,
            paddingBottom: 10,
            marginBottom: 10,
            marginTop: 2,
          }}>
          {/* SVG */}
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{dummyData.email}</Text>
        </View>

        {/* DateContainer */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            borderBlockColor: colors.light_gray,
            borderBottomWidth: 2,
            paddingBottom: 10,
            marginBottom: 10,
          }}>
          {/* SVG */}
          <View>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{dummyData.transactionDate}</Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>{dummyData.orderNumber}</Text>
          </View>
        </View>

        {/* Church Container */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          {/* SVG */}
          <View>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{dummyData.churchText}</Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>{dummyData.churchName}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      <View style={[commonStyles.card, { marginVertical: 50, marginHorizontal: 100, alignItems: 'center' }]}>
        <Text style={commonStyles.paragraph}>Logo</Text>
      </View>
      <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue, alignSelf: 'center' }]}>
        Requires Information
      </Text>
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
        buttonMargin={4}
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
        {activeTab === 'information' ? appendDepositDetails() : <Text>Contenido de Resumen de la Caja jjjjj</Text>}
      </View>

      <View style={{ marginTop: 'auto', padding: 20, width: '100%' }}>
        <TouchableOpacity
          style={[commonStyles.buttonNoShadow, { width: '100%' }]}
          onPress={() => {
            router.replace('./');
          }}>
          <Text style={[commonStyles.header, { color: colors.white }]}>Confirm Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            commonStyles.buttonNoShadow,
            {
              backgroundColor: colors.white,
              borderColor: colors.red_label,
              borderWidth: 2,
              marginTop: 10,
              width: '100%',
            },
          ]}
          onPress={() => {
            router.replace('./');
          }}>
          <Text style={[commonStyles.header, { color: colors.red_label }]}>Decline</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
