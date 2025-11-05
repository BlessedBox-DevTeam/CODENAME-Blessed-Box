import axios from 'axios';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Checkbox from '../components/icons/Checkbox';
import LoadingOverlay from '../components/LoadingSpinner';
import { getAccessToken, saveAccessToken, saveRefreshToken } from '../helpers/helpers';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;

console.log(extra);

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    const response = await axios.post(`${API_URL}:${API_PORT}/api/auth/login`, {
      email: email,
      password: password,
      keepMeSignedIn: keepMeSignedIn,
    });
    if (response.data.success) {
      await saveAccessToken(response.data.accessToken);
      if (keepMeSignedIn && response.data.refreshToken) {
        await saveRefreshToken(response.data.refreshToken);
      }
      const token = await getAccessToken();
      const socket = io(`${API_URL}:${API_PORT}`, { auth: { token } });
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
          animationType="slide"
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
                width: '80%',
                height: '100%',
              }}>
              <Text style={commonStyles.paragraph}>Your email or password is incorrect</Text>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={[commonStyles.title, { paddingTop: 15 }]}>Blessed Box</Text>
        <View style={{ flexDirection: 'column', gap: 16, width: '100%' }}>
          <TextInput style={commonStyles.input} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} value={email} />
          <TextInput style={commonStyles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} value={password} />
        </View>
        <TouchableOpacity style={[commonStyles.button]} onPress={handleLogin}>
          <Text style={[commonStyles.header, { color: colors.white }]}>Login</Text>
        </TouchableOpacity>
        <Checkbox onChange={(value) => setKeepMeSignedIn(value)} label="Keep me signed in" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
