import axios from 'axios';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';

import { Alert, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Checkbox from '../components/icons/Checkbox';
import LoadingOverlay from '../components/LoadingSpinner';
import { saveAccessToken, saveRefreshToken } from '../helpers/helpers';
import { initSocket } from '../socketService';

const extra = Constants.expoConfig?.extra;

const API_URL = extra?.URL || 'https://blessedbox.org';
const API_PORT = extra?.PORT;

export default function Index() {
  const router = useRouter();

  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);

  {
    /* RESPONSIVE DESIGN */
  }

  const isSmallScreen = height < 750;
  const isVerySmallScreen = height < 680;

  const horizontalPadding = width < 360 ? 22 : 30;

  const headerHeight = isVerySmallScreen ? '31%' : isSmallScreen ? '32%' : '34%';

  const logoSize = isVerySmallScreen ? 82 : isSmallScreen ? 92 : 105;

  const logoIconSize = isVerySmallScreen ? 45 : isSmallScreen ? 50 : 58;

  const titleSize = isVerySmallScreen ? 28 : isSmallScreen ? 31 : 34;

  const sloganSize = isVerySmallScreen ? 14 : isSmallScreen ? 15 : 17;

  const welcomeSize = isVerySmallScreen ? 27 : isSmallScreen ? 30 : 34;

  const subtitleSize = isVerySmallScreen ? 15 : isSmallScreen ? 16 : 18;

  const inputHeight = isVerySmallScreen ? 48 : isSmallScreen ? 52 : 55;

  const buttonHeight = isVerySmallScreen ? 51 : isSmallScreen ? 55 : 58;

  {
    /* LOGIN */
  }

  const handleLogin = async () => {
    const validateInputs = (email: string, password: string) => {
      const errors: {
        email?: string;
        password?: string;
      } = {};

      if (!email || email.trim() === '') {
        errors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.email = 'The email is not valid.';
      }

      if (!password || password.trim() === '') {
        errors.password = 'Password is required.';
      } else if (password.length < 6) {
        errors.password = 'The password must have at least 6 characters.';
      }

      return {
        valid: Object.keys(errors).length === 0,
        errors,
      };
    };

    const { valid } = validateInputs(email, password);

    // Stop if the information is not valid
    if (!valid) {
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password,
        keepMeSignedIn: keepMeSignedIn,
      });

      if (response.data.success) {
        await saveAccessToken(response.data.accessToken);

        if (keepMeSignedIn && response.data.refreshToken) {
          await saveRefreshToken(response.data.refreshToken);
        }

        await initSocket();

        setIsLoading(false);

        router.replace('/home');
      } else {
        setIsLoading(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.log('Login error:', error);

      setIsLoading(false);
      setModalVisible(true);
    }
  };

  {
    /* Screen */
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFF8F1',
        }}
        edges={['top', 'left', 'right', 'bottom']}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {/* Loading */}

        <LoadingOverlay visible={isLoading} />

        {/* ERROR MODAL */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(false);
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(38, 24, 16, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 25,
              }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#FFF8F1',
                    borderRadius: 25,
                    padding: 25,
                  }}>
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: '800',
                      color: '#261810',
                      textAlign: 'center',
                      marginBottom: 10,
                    }}>
                    Something went wrong
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      color: '#96745C',
                      textAlign: 'center',
                      lineHeight: 22,
                      marginBottom: 20,
                    }}>
                    Please verify your email and password and try again.
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setModalVisible(false)}
                    style={{
                      height: 50,
                      borderRadius: 17,
                      backgroundColor: '#D95727',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 17,
                        fontWeight: '700',
                      }}>
                      I understand
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* MAIN CONTENT */}

        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            style={{
              flex: 1,
            }}>
            {/* HEADER*/}

            <View
              style={{
                height: headerHeight,
                backgroundColor: '#F3B080',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                overflow: 'hidden',
              }}>
              {/* Decorative circle 1 */}

              <View
                style={{
                  position: 'absolute',
                  width: isSmallScreen ? 75 : 95,
                  height: isSmallScreen ? 75 : 95,
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  top: isSmallScreen ? 35 : 55,
                  left: 42,
                }}
              />

              {/* Decorative circle 2 */}

              <View
                style={{
                  position: 'absolute',
                  width: isSmallScreen ? 105 : 125,
                  height: isSmallScreen ? 105 : 125,
                  borderRadius: 100,
                  backgroundColor: 'rgba(203,83,38,0.12)',
                  top: isSmallScreen ? 30 : 48,
                  right: 62,
                }}
              />

              {/* Decorative circle 3 */}

              <View
                style={{
                  position: 'absolute',
                  width: isSmallScreen ? 55 : 65,
                  height: isSmallScreen ? 55 : 65,
                  borderRadius: 100,
                  backgroundColor: 'rgba(203,83,38,0.12)',
                  top: isSmallScreen ? 92 : 120,
                  right: 30,
                }}
              />

              {/* LOGO */}

              <View
                style={{
                  width: logoSize,
                  height: logoSize,
                  borderRadius: isSmallScreen ? 28 : 32,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isSmallScreen ? 9 : 13,

                  shadowColor: '#8E4D2D',

                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },

                  shadowOpacity: 0.12,
                  shadowRadius: 10,

                  elevation: 4,
                }}>
                <MaterialCommunityIcons name="gift" size={logoIconSize} color="#D95727" />
              </View>

              {/* APP NAME */}

              <Text
                style={{
                  fontSize: titleSize,
                  fontWeight: '900',
                  letterSpacing: -1,
                  color: '#261810',
                  marginBottom: isVerySmallScreen ? 3 : 6,
                }}>
                BlessedBox
              </Text>

              {/* SLOGAN */}

              <Text
                style={{
                  fontSize: sloganSize,
                  fontWeight: '600',
                  color: '#8E6B52',
                  textAlign: 'center',
                }}>
                Each box counts. Every child matters.
              </Text>
            </View>

            {/* LOGIN FORM */}

            <View
              style={{
                flex: 1,
                backgroundColor: '#FFF8F1',

                paddingHorizontal: horizontalPadding,

                paddingTop: isVerySmallScreen ? 15 : isSmallScreen ? 18 : 24,

                paddingBottom: 8,
              }}>
              {/* WELCOME */}
              <Text
                style={{
                  fontSize: welcomeSize,
                  lineHeight: welcomeSize + 4,
                  fontWeight: '900',
                  letterSpacing: -0.8,
                  color: '#261810',
                  marginBottom: isVerySmallScreen ? 2 : 5,
                }}>
                Welcome back!
              </Text>

              {/* SUBTITLE */}

              <Text
                style={{
                  fontSize: subtitleSize,
                  color: '#96745C',

                  marginBottom: isVerySmallScreen ? 12 : isSmallScreen ? 16 : 22,
                }}>
                Sign in to view your donations
              </Text>

              {/* EMAIL LABEL */}

              <Text
                style={{
                  fontSize: isVerySmallScreen ? 13 : 15,

                  fontWeight: '700',

                  letterSpacing: 0.3,

                  color: '#96745C',

                  marginBottom: isVerySmallScreen ? 5 : 7,
                }}>
                EMAIL
              </Text>

              {/* EMAIL INPUT */}

              <TextInput
                style={{
                  width: '100%',
                  height: inputHeight,

                  borderRadius: isVerySmallScreen ? 17 : 20,

                  backgroundColor: '#FBEEDF',

                  paddingHorizontal: isVerySmallScreen ? 17 : 20,

                  fontSize: isVerySmallScreen ? 15 : 17,

                  color: '#5E483A',

                  marginBottom: isVerySmallScreen ? 11 : isSmallScreen ? 14 : 18,
                }}
                placeholder="you@email.com"
                placeholderTextColor="#A18E82"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              {/* PASSWORD LABEL */}

              <Text
                style={{
                  fontSize: isVerySmallScreen ? 13 : 15,

                  fontWeight: '700',

                  letterSpacing: 0.3,

                  color: '#96745C',

                  marginBottom: isVerySmallScreen ? 5 : 7,
                }}>
                PASSWORD
              </Text>

              {/* PASSWORD INPUT */}
              <View
                style={{
                  width: '100%',
                  height: inputHeight,

                  borderRadius: isVerySmallScreen ? 17 : 20,

                  backgroundColor: '#FBEEDF',

                  flexDirection: 'row',

                  alignItems: 'center',

                  paddingLeft: isVerySmallScreen ? 17 : 20,

                  paddingRight: isVerySmallScreen ? 14 : 18,

                  marginBottom: isVerySmallScreen ? 10 : 14,
                }}>
                <TextInput
                  style={{
                    flex: 1,

                    height: '100%',

                    fontSize: isVerySmallScreen ? 15 : 17,

                    color: '#5E483A',

                    paddingVertical: 0,

                    paddingRight: 5,
                  }}
                  placeholder="password"
                  placeholderTextColor="#A18E82"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                />

                {/* PASSWORD EYE */}

                <TouchableOpacity
                  activeOpacity={0.65}
                  onPress={() => setShowPassword((previous) => !previous)}
                  hitSlop={{
                    top: 8,
                    bottom: 8,
                    left: 8,
                    right: 8,
                  }}
                  style={{
                    width: 34,
                    height: 34,

                    alignItems: 'center',
                    justifyContent: 'center',

                    marginLeft: 8,
                  }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={25} color="#96745C" />
                </TouchableOpacity>
              </View>

              {/* FORGOT PASSWORD */}

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  alignSelf: 'flex-end',

                  marginBottom: isVerySmallScreen ? 11 : isSmallScreen ? 15 : 20,
                }}>
                <Text
                  style={{
                    fontSize: isVerySmallScreen ? 13 : 15,

                    fontWeight: '800',

                    color: '#D95727',
                  }}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              {/* LOGIN BUTTON */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                style={{
                  width: '100%',
                  height: buttonHeight,

                  borderRadius: isVerySmallScreen ? 18 : 21,

                  backgroundColor: '#D95727',

                  alignItems: 'center',
                  justifyContent: 'center',

                  flexDirection: 'row',

                  marginBottom: isVerySmallScreen ? 11 : isSmallScreen ? 15 : 20,

                  shadowColor: '#D95727',

                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },

                  shadowOpacity: 0.22,
                  shadowRadius: 10,

                  elevation: 5,
                }}>
                <Text
                  style={{
                    fontSize: isVerySmallScreen ? 17 : 20,

                    fontWeight: '800',

                    color: '#FFFFFF',
                  }}>
                  Sign in
                </Text>

                <Text
                  style={{
                    fontSize: isVerySmallScreen ? 27 : 31,

                    lineHeight: isVerySmallScreen ? 29 : 33,

                    color: '#FFFFFF',

                    marginLeft: 9,

                    marginTop: -2,
                  }}>
                  →
                </Text>
              </TouchableOpacity>

              {/* REGISTER */}

              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'center',

                  alignItems: 'center',

                  flexWrap: 'wrap',
                }}>
                <Text
                  style={{
                    fontSize: isVerySmallScreen ? 14 : 16,

                    color: '#96745C',
                  }}>
                  Don't have an account?{' '}
                </Text>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text
                    style={{
                      fontSize: isVerySmallScreen ? 14 : 16,

                      fontWeight: '900',

                      color: '#D95727',
                    }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
