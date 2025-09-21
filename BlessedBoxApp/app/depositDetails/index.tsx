import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../baseStyles/colors';
import { Modal } from 'react-native';

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
  const [showWarning, setShowWarning] = useState(false);

  const secondDummyData = {
    BlessedBox1: '2x Blessed Box',
    BlessedBox1Info: 'M 10-14',
    BlessedBox2: '1x Blessed Box',
    BlessedBox2Info: 'F 2-4',
    BlessedBox3: '3x Blessed Box',
    BlessedBox3Info: 'M 5-9',
    BlessedBox4: '4x Blessed Box',
    BlessedBox4Info: 'Unlabeled',
  };

  const appendDepositInfo = () => {
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

  const appendBoxSummary = () => {
    // Divide items into two columns
    const leftColumn = [
      secondDummyData.BlessedBox1,
      secondDummyData.BlessedBox2,
      secondDummyData.BlessedBox3,
      secondDummyData.BlessedBox4,
    ];
    const rightColumn = [
      secondDummyData.BlessedBox1Info,
      secondDummyData.BlessedBox2Info,
      secondDummyData.BlessedBox3Info,
      secondDummyData.BlessedBox4Info,
    ];

    return (
      <View style={{ flexDirection: 'column', paddingVertical: 10 }}>
        {leftColumn.map((item, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              borderBottomColor: colors.light_gray,
              borderBottomWidth: idx === leftColumn.length - 1 ? 0 : 2,
              paddingBottom: 10,
              marginBottom: 10,
              gap: 16,
            }}>
            {/* First Column */}
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{item}</Text>
            </View>
            {/* Second Column: Text is a placeholder for now*/}
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={[commonStyles.paragraph, { color: colors.dark_blue, fontStyle: 'italic' }]}>
                {rightColumn[idx]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
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
          height: 50,
          marginBottom: 20,
          marginTop: 10,
        }}
        textStyle={{
          fontFamily: commonStyles.paragraph.fontFamily,
        }}
        selectedTextStyle={{
          fontFamily: commonStyles.paragraphBold.fontFamily,
        }}></SwitchSelector>

      <View style={commonStyles.card}>{activeTab === 'information' ? appendDepositInfo() : appendBoxSummary()}</View>

      {/* Warning Modal */}
      <Modal visible={showWarning} transparent animationType="fade" onRequestClose={() => setShowWarning(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              maxWidth: 400,
              borderRadius: 10,
              backgroundColor: colors.white,
              padding: 32,
              flexDirection: 'column',
              alignSelf: 'center',
            }}>
            <Text style={[commonStyles.paragraph, { marginBottom: 32, textAlign: 'center' }]}>
              Are you sure you want to decline this deposit?
            </Text>
            <View style={{ flexDirection: 'row', gap: 32 }}>
              <TouchableOpacity
                style={[
                  commonStyles.buttonNoShadow,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.dark_gray,
                    borderWidth: 2,
                    flex: 1,
                  },
                ]}
                onPress={() => setShowWarning(false)}>
                <Text style={[commonStyles.header, { color: colors.dark_gray }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.buttonNoShadow, { backgroundColor: colors.red_label, flex: 1 }]}
                onPress={() => {
                  setShowWarning(false);
                  router.replace('./order');
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <TouchableOpacity
          style={commonStyles.buttonNoShadow}
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
            },
          ]}
          onPress={() => setShowWarning(true)}>
          <Text style={[commonStyles.header, { color: colors.red_label }]}>Decline</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
