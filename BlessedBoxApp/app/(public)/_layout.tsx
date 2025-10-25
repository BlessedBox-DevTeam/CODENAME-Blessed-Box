import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getAccessToken, getRefreshToken, saveAccessToken } from '../helpers/helpers';
import axios from 'axios';
import Constants from 'expo-constants';
import { jwtDecode } from 'jwt-decode';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;

export default function LoginLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      let authenticated = false;

      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken) {
        try {
          const decoded: any = jwtDecode(accessToken);
          const now = Math.floor(Date.now() / 1000);
          authenticated = decoded.exp > now;
        } catch {
          authenticated = false;
        }
      }

      if (!authenticated && refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}:${API_PORT}/api/auth/refresh`, { refreshToken });
          if (data.success) {
            await saveAccessToken(data.accessToken);
            authenticated = true;
          }
        } catch {
          authenticated = false;
        }
      }

      if (authenticated) {
        router.replace('../home');
      } else {
        setCheckingAuth(false);
      }
    }

    init();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return <Slot />;
}
