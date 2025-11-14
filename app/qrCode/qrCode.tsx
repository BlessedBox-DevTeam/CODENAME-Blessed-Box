import { Camera, CameraView } from 'expo-camera';
import { router, Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SwitchSelector from 'react-native-switch-selector';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import BackArrow from '../components/icons/BackArrow';
import axios from 'axios';
import Constants from 'expo-constants';
import LoadingOverlay from '../components/LoadingSpinner';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL || 'https://blessedbox.org';
const API_PORT = extra?.PORT;

export default function Index() {
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [maxCameraWidth, setMaxCameraWidth] = useState<number | `${number}%`>('100%');
  const [maxManualWidth, setManualWidth] = useState<number | `${number}%`>(0);
  const [scanned, setScanned] = useState(false);
  const [isScanTabActive, setIsScanTabActive] = useState(true);
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isScanTabActive && hasPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [isScanTabActive]);

  useEffect(() => {
    if (isScanTabActive) {
      setScanned(false);
    }
  }, [isScanTabActive]);

  const handleQRCodeMethod = (value: string) => {
    if (value === 'scan') {
      setMaxCameraWidth('100%');
      setManualWidth(0);
      setIsScanTabActive(true);
      setScanned(false);
    } else {
      setMaxCameraWidth(0);
      setManualWidth('100%');
      setIsScanTabActive(false);
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanned) {
      setIsLoading(true);
      setScanned(true);
      const codeValue = data;
      const { response, message } = (await axios.post(`${API_URL}/api/qrCodes/isQRCode`, { qrCodeValue: codeValue })).data;
      console.log(response);
      setIsLoading(false);
      if (response) {
        router.push('/orders/order');
      } else {
        alert(message);
      }
    }
  };

  const handleChangeText = (text: string) => {
    const formatted = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setCode(formatted);
  };

  const handleBackPress = () => {
    return router.back();
  };

  if (hasPermission === null) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se tienen permisos para usar la cámara.</Text>;
  }

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
        <LoadingOverlay visible={isLoading} />
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 0,
          }}>
          <BackArrow onPress={handleBackPress} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={commonStyles.header}>Order Summary</Text>
          </View>
          <View style={{ width: 25 }} />
        </View>

        {/* SwitchSelector */}
        <View>
          <SwitchSelector
            options={[
              { label: 'Scan QR', value: 'scan' },
              { label: 'Manual Code', value: 'show' },
            ]}
            initial={0}
            onPress={handleQRCodeMethod}
            textColor={colors.dark_gray}
            selectedColor={colors.white}
            buttonColor={colors.dark_blue}
            borderColor={colors.dark_blue}
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
            }}
          />
        </View>

        {/* Body */}
        <View style={{ flex: 1 }}>
          {isScanTabActive ? (
            <View style={{ flex: 1 }}>
              <CameraView style={{ flex: 1 }} facing={facing} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: 10,
                  borderRadius: 25,
                }}
                onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{facing === 'back' ? 'Front' : 'Rear'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, padding: 20 }}>
              <View
                style={[
                  commonStyles.card,
                  {
                    gap: 16,
                  },
                ]}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: '100%',
                    alignItems: 'center',
                    borderColor: colors.gray,
                    paddingBottom: 10,
                  }}>
                  <Image source={require('../../assets/images/test-qr.png')} style={{ width: 125, height: 125, resizeMode: 'contain' }} />
                  <Text style={[commonStyles.paragraph, { alignSelf: 'center', letterSpacing: 4 }]}>1234ABCD</Text>
                </View>

                <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue, alignSelf: 'center' }]}>Trouble Scanning the QR Code?</Text>

                <KeyboardAvoidingView style={{ gap: 5 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <Text style={commonStyles.paragraph}>Enter the #id of the RC</Text>
                  <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
                    <View
                      style={{
                        backgroundColor: colors.white,
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: colors.gray,
                        position: 'relative',
                        padding: 10,
                      }}>
                      <TextInput
                        ref={inputRef}
                        value={code}
                        onChangeText={handleChangeText}
                        keyboardType="default"
                        maxLength={8}
                        style={{
                          position: 'absolute',
                          opacity: 0,
                          width: '100%',
                        }}
                        autoFocus={false}
                      />
                      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                        {[...Array(8)].map((_, i) => (
                          <View key={i} style={{ width: 30, alignItems: 'center', padding: 5 }}>
                            <Text style={commonStyles.header}>{code[i] || ''}</Text>
                            <View
                              style={{
                                height: 2,
                                width: '100%',
                                backgroundColor: colors.dark_blue,
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </View>
              <TouchableOpacity
                style={[commonStyles.button, { marginTop: 'auto' }]}
                onPress={async () => {
                  setIsLoading(true);
                  const { response, message } = (await axios.post(`${API_URL}/api/backupKeys/isKey`, { keyValue: code })).data;
                  setIsLoading(false);
                  if (response) {
                    router.push('/orders/order');
                  } else {
                    alert(message);
                  }
                }}>
                <Text style={[commonStyles.header, { color: colors.white }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
