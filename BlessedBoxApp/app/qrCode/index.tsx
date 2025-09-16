import { CameraType, CameraView } from 'expo-camera';
import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SwitchSelector from 'react-native-switch-selector';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [maxCameraWidth, setMaxCameraWidth] = useState<number | `${number}%`>('100%');
  const [maxManualWidth, setManualWidth] = useState<number | `${number}%`>(0);
  const [code, setCode] = useState('');
  const inputRef = useRef(null);

  // const [permission, requestPermission] = useCameraPermissions();

  const CustomCodeInput = () => {};
  const handleChangeText = (text: string) => {
    // Limit to 8 characters and only alphanumerics if needed
    const formatted = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setCode(formatted);
  };

  const handleQRCodeMethod = (value: string) => {
    if (value === 'scan') {
      setMaxCameraWidth('100%');
      setManualWidth(0);
    } else {
      setMaxCameraWidth(0);
      setManualWidth('100%');
    }
  };
  const handleBackPress = () => {
    return router.replace('./home');
  };
  return (
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
          <Text style={commonStyles.header}>Qr Code</Text>
        </View>
        <View>
          <SwitchSelector
            options={[
              { label: 'Scan QR', value: 'scan' },
              { label: 'Manual Code', value: 'show' },
            ]}
            initial={0}
            onPress={(value = '') => {
              handleQRCodeMethod(value === 'scan' ? 'scan' : 'show');
            }}
            textColor={colors.dark_gray}
            selectedColor={colors.white}
            buttonColor={colors.dark_blue}
            borderColor={colors.dark_blue}
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
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
          }}>
          <CameraView
            style={{
              width: '100%',
              height: '100%',
              maxWidth: maxCameraWidth,
            }}
            facing={facing}></CameraView>
          <View
            style={[
              commonStyles.card,
              {
                width: '100%',
                height: '100%',
                maxWidth: maxManualWidth,
                gap: 16,
              },
            ]}>
            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderColor: colors.gray,
              }}>
              <Text style={{ height: 50 }}>Placeholder Image</Text>
            </View>
            <Text style={[commonStyles.header, { alignSelf: 'center' }]}>Trouble Scanning the QR Code?</Text>
            <Text style={commonStyles.paragraph}>Enter the #id of the Recollection Center</Text>
            <TouchableWithoutFeedback onPress={() => {}}>
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 2,
                  }}>
                  {[...Array(8)].map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: 35,
                        alignItems: 'center',
                        padding: 5,
                      }}>
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
            <TouchableOpacity
              style={[commonStyles.button]}
              onPress={() => {
                router.replace('./order');
              }}>
              <Text style={[commonStyles.header, { color: colors.white }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
