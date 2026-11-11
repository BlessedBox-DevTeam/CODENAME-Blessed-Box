import { Camera, CameraView } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SwitchSelector from 'react-native-switch-selector';
import commonStyles from '../../baseStyles/baseStyles';
import colors from '../../baseStyles/colors';
import BackArrow from '../../components/icons/BackArrow';
import LoadingOverlay from '../../components/LoadingSpinner';
import { MANAGER_ROLE_CODE } from '../../helpers/constants';
import { getUserFromToken } from '../../helpers/helpers';
import { getManualAccessCode, isBackupKey, scanQRCode } from '../../services/services';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [maxCameraWidth, setMaxCameraWidth] = useState<number | `${number}%`>('100%');
  const [maxManualWidth, setManualWidth] = useState<number | `${number}%`>(0);
  const [scanned, setScanned] = useState(false);
  const [isScanTabActive, setIsScanTabActive] = useState(true);
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  const manualFormScrollRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [manualAccessCode, setManualAccessCode] = useState<string | null>(null);
  const [isAccessCodeLoading, setIsAccessCodeLoading] = useState(false);
  const focusSessionRef = useRef(0);
  const accessCodeRequestRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const focusSession = ++focusSessionRef.current;
      setManualAccessCode(null);
      setIsManager(false);

      void getUserFromToken().then((user) => {
        if (focusSessionRef.current === focusSession) {
          setIsManager(Boolean(user?.roles?.some((role) => role?.code === MANAGER_ROLE_CODE)));
        }
      });

      return () => {
        focusSessionRef.current += 1;
        accessCodeRequestRef.current += 1;
        setManualAccessCode(null);
        setIsAccessCodeLoading(false);
        setIsManager(false);
      };
    }, [])
  );

  const handleGetManualAccessCode = async () => {
    const focusSession = focusSessionRef.current;
    const requestId = ++accessCodeRequestRef.current;
    setManualAccessCode(null);
    setIsAccessCodeLoading(true);

    try {
      const { data } = await getManualAccessCode();
      const accessCode = data.accessCode;

      if (typeof accessCode !== 'string' || !accessCode.trim()) {
        throw new Error('The server did not return a valid access code.');
      }

      if (focusSessionRef.current === focusSession && accessCodeRequestRef.current === requestId) {
        setManualAccessCode(accessCode);
      }
    } catch (error) {
      console.error('Error retrieving the recollection center access code:', error);
      if (focusSessionRef.current === focusSession && accessCodeRequestRef.current === requestId) {
        Alert.alert('Unable to get access code', 'Please try again later.');
      }
    } finally {
      if (focusSessionRef.current === focusSession && accessCodeRequestRef.current === requestId) {
        setIsAccessCodeLoading(false);
      }
    }
  };

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
      const { response, message } = (await scanQRCode(codeValue)).data;
      setIsLoading(false);
      if (response) {
        router.push('/orders/order');
      } else {
        alert(message);
      }
    }
  };

  const handleChangeText = (text: string) => {
    const formatted = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
    setCode(formatted);
  };

  const handleBackPress = () => {
    return router.back();
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ backgroundColor: colors.auth.header, flex: 1 }}>
        <LoadingOverlay visible={isLoading} />
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 0,
          }}>
          <BackArrow onPress={handleBackPress} color={colors.text.primary} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[commonStyles.header, { color: colors.text.primary }]}>
                Drop-off Center
              </Text>
              {isManager && (
                <TouchableOpacity
                  onPress={handleGetManualAccessCode}
                  disabled={isAccessCodeLoading}
                  accessibilityRole="button"
                  accessibilityLabel="Get recollection center access code">
                  {isAccessCodeLoading ? (
                    <ActivityIndicator size="small" color={colors.brand.dark} />
                  ) : (
                    <Ionicons name="key-outline" size={20} color={colors.brand.dark} />
                  )}
                </TouchableOpacity>
              )}
            </View>
            {manualAccessCode !== null && (
              <Text style={[commonStyles.paragraphBold, { color: colors.brand.dark }]}>
                Access code: {manualAccessCode}
              </Text>
            )}
          </View>
          <View style={{ width: 44 }} />
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
            textColor={colors.text.secondary}
            selectedColor={colors.surface.card}
            buttonColor={colors.brand.dark}
            borderColor={colors.brand.dark}
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
            hasPermission === true ? (
              <View style={{ flex: 1 }}>
                <CameraView
                  style={{ flex: 1 }}
                  facing={facing}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: colors.effects.overlayStrong,
                    padding: 10,
                    borderRadius: 25,
                  }}
                  onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}>
                  <Text style={[commonStyles.paragraphBold, { color: colors.text.inverse }]}>
                    {facing === 'back' ? 'Front' : 'Rear'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={commonStyles.paragraph}>
                  {hasPermission === null
                    ? 'Solicitando permisos...'
                    : 'No se tienen permisos para usar la cámara.'}
                </Text>
              </View>
            )
          ) : (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ScrollView
                ref={manualFormScrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
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
                        borderColor: colors.effects.gray,
                        paddingBottom: 10,
                      }}>
                      <Image
                        source={require('../../../assets/images/test-qr.png')}
                        style={{ width: 125, height: 125, resizeMode: 'contain' }}
                      />
                      <Text
                        style={[
                          commonStyles.paragraph,
                          { alignSelf: 'center', letterSpacing: 4 },
                        ]}>
                        123ABC
                      </Text>
                    </View>

                    <Text
                      style={[
                        commonStyles.paragraphBold,
                        { color: colors.brand.dark, alignSelf: 'center' },
                      ]}>
                      Trouble Scanning the QR Code?
                    </Text>

                    <View style={{ gap: 5 }}>
                      <Text style={commonStyles.paragraph}>Enter Drop-off Code</Text>
                      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
                        <View
                          style={{
                            backgroundColor: colors.surface.card,
                            borderWidth: 2,
                            borderRadius: 10,
                            borderColor: colors.effects.gray,
                            position: 'relative',
                            padding: 10,
                          }}>
                          <TextInput
                            ref={inputRef}
                            value={code}
                            onChangeText={handleChangeText}
                            keyboardType="default"
                            maxLength={6}
                            style={{
                              position: 'absolute',
                              opacity: 0,
                              width: '100%',
                            }}
                            onFocus={() => manualFormScrollRef.current?.scrollToEnd({ animated: true })}
                            autoFocus={false}
                          />
                          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                            {[...Array(6)].map((_, i) => (
                              <View key={i} style={{ width: 30, alignItems: 'center', padding: 5 }}>
                                <Text style={commonStyles.header}>{code[i] || ''}</Text>
                                <View
                                  style={{
                                    height: 2,
                                    width: '100%',
                                    backgroundColor: colors.brand.dark,
                                  }}
                                />
                              </View>
                            ))}
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                <TouchableOpacity
                  style={[commonStyles.button, { marginTop: 'auto' }]}
                  onPress={async () => {
                    const showAlert = (message: string) => {
                      alert(message);
                    };
                    if (code.length < 6) {
                      return showAlert('Please enter a valid 6-character code.');
                    }
                    setIsLoading(true);
                    const { response, message } = (await isBackupKey(code)).data;
                    setIsLoading(false);
                    if (response) {
                      router.push('/orders/order');
                    } else {
                      showAlert(message);
                    }
                  }}>
                  <Text style={[commonStyles.header, { color: colors.text.inverse }]}>Confirm</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
