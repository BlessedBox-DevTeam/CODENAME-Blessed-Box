import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import SwitchSelector from 'react-native-switch-selector';
import colors from '../baseStyles/colors';
import { Modal } from 'react-native';
import GenderInitial from '../components/GenderInitial';
import UserAvatar from '../components/icons/UserAvatar';
import Church from '../components/icons/Church';
import Mail from '../components/icons/Mail';
import Alert from '../components/icons/Alert';
import BackArrow from '../components/icons/BackArrow';
import Clock from '../components/icons/Clock';
import axios from 'axios';
import Constants from 'expo-constants';
import LoadingOverlay from '../components/LoadingSpinner';

/**
 * Deposit Details Screen
 * Displays deposit information and box summary with tab switching.
 * Shows a warning modal when declining the deposit.
 */
export default function Index() {
  const extra = Constants.expoConfig?.extra;
  const API_URL = extra?.URL;
  const API_PORT = extra?.PORT;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'information' | 'summary'>('information');
  const [isLoading, setIsLoading] = useState(true);

  // Obtain transactionId from query parameters
  let { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  transactionId = JSON.parse(transactionId);
  console.log(transactionId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { response },
        } = await axios.get(`${API_URL}:${API_PORT}/api/transactions/transactionDetails`, { params: { transactionId: 1 } });
        console.log(response);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * Navigates back to the order screen.
   */
  const handleReturn = () => {
    return router.back();
  };
  /**
   * Handles tab switching between deposit info and box summary.
   * @param value - The selected tab value.
   */
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

  /**
   * Renders the deposit information section.
   * @returns {JSX.Element}
   */
  const appendDepositInfo = () => {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
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
            paddingVertical: 10,
          }}>
          {/* SVG */}
          <UserAvatar width={30} height={30}></UserAvatar>
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
            paddingVertical: 10,
          }}>
          {/* SVG */}
          <Mail width={30} height={30}></Mail>
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
            paddingVertical: 10,
          }}>
          {/* SVG */}
          <Clock height={30} width={30}></Clock>
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
            paddingVertical: 10,
          }}>
          {/* SVG */}
          <Church width={30} height={30}></Church>
          <View>
            <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{dummyData.churchText}</Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>{dummyData.churchName}</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renders the box summary section in two columns.
   * @returns {JSX.Element}
   */
  const appendBoxSummary = () => {
    const leftColumn = [
      {
        gender: 1,
        quantity: 10,
        age: '2-4',
      },
      {
        gender: 0,
        quantity: 10,
        age: '2-4',
      },
      {
        gender: 0,
        quantity: 2,
        age: '5-9',
      },
      {
        gender: 0,
        quantity: 3,
        age: '10-14',
      },
      {
        gender: false,
        quantity: 3,
        age: false,
      },
    ];
    if (isLoading) {
      return <LoadingOverlay />;
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        {leftColumn.map((item, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              borderBottomColor: colors.light_gray,
              borderBottomWidth: idx === leftColumn.length - 1 ? 0 : 2,
              justifyContent: 'space-between',
              overflow: 'hidden',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            {/* First Column */}
            <View style={{ flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ width: 30 }}>
                <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{`${item.quantity}x`}</Text>
              </View>
              <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>{'Blessed Box'}</Text>
            </View>
            {/* Second Column */}
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              {item.gender === false || item.age === false ? (
                <Text style={[commonStyles.paragraphItalic, { color: colors.dark_gray }]}>Unlabeled</Text>
              ) : (
                <>
                  <GenderInitial genderCode={item.gender} />
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
                    <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>{item.age}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header Container */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <BackArrow onPress={handleReturn} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Deposit Details</Text>
          </View>
          <View style={{ width: 25 }} />
        </View>

        {/* Logo */}
        <View style={[commonStyles.card, { width: 100, alignSelf: 'center', alignItems: 'center', marginBottom: 16 }]}>
          <Text style={commonStyles.paragraph}>Logo</Text>
        </View>

        {/* Deposit Status Container */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 16 }}>
          <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue, alignSelf: 'center' }]}>Requires Confirmation</Text>
          <Alert width={25} height={25}></Alert>
        </View>
        {/* Main Container */}
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* Tab Container */}
          <SwitchSelector
            options={[
              { label: 'Deposit Info', value: 'information' },
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
              marginBottom: 16,
            }}
            textStyle={{
              fontFamily: commonStyles.paragraph.fontFamily,
            }}
            selectedTextStyle={{
              fontFamily: commonStyles.paragraphBold.fontFamily,
            }}></SwitchSelector>

          {/* Main Container */}
          <View style={[commonStyles.card, { width: '100%', height: 250, paddingVertical: 14 }]}>
            <ScrollView showsVerticalScrollIndicator={true} style={{ flexGrow: 1 }}>
              {activeTab === 'information' ? appendDepositInfo() : appendBoxSummary()}
            </ScrollView>
          </View>

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
                <Text style={[commonStyles.paragraph, { marginBottom: 32, textAlign: 'center' }]}>Are you sure you want to decline this deposit?</Text>
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

          {/* Buttons Container */}
          <View style={{ marginTop: 'auto', paddingBottom: 20 }}>
            {/* Confirm Button */}
            <TouchableOpacity
              style={commonStyles.buttonNoShadow}
              onPress={() => {
                router.replace('./');
              }}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Confirm Deposit</Text>
            </TouchableOpacity>
            {/* Decline Button */}
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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
