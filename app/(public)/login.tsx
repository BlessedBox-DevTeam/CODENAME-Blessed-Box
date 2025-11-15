import axios from 'axios';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const validateInputs = (email, password) => {
      const errors = {};

      if (!email || email.trim() === '') {
        errors.email = 'El email es requerido.';
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.email = 'El email no es válido.';
      }
      if (!password || password.trim() === '') {
        errors.password = 'La contraseña es requerida.';
      } else if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
      return {
        valid: Object.keys(errors).length === 0,
        errors,
      };
    };
    const { valid, errors } = validateInputs(email, password);
    if (!valid) {
      setModalVisible(true);
      return;
    }
    setIsLoading(true);
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
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flexDirection: 'column',
          gap: 16,
          padding: 20,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingOverlay visible={isLoading} />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
              }}>
              <Text style={[commonStyles.paragraph, { color: colors.red }]}>Your email or password is incorrect</Text>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={[commonStyles.title, { paddingTop: 15 }]}>Blessed Box</Text>
        <View style={{ flexDirection: 'column', gap: 16, width: '100%' }}>
          <TextInput style={commonStyles.input} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} value={email} />
          <TextInput style={commonStyles.input} placeholder="Contraseña" secureTextEntry autoCapitalize="none" onChangeText={setPassword} value={password} />
        </View>
        <View style={{ flexDirection: 'column', gap: 16, width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <TouchableOpacity style={[commonStyles.button]} onPress={handleLogin}>
            <Text style={[commonStyles.header, { color: colors.white }]}>Login</Text>
          </TouchableOpacity>
          <Checkbox onChange={(value) => setKeepMeSignedIn(value)} label="Keep me signed in" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
