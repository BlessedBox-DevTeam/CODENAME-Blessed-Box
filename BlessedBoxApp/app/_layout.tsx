import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { loadFonts } from '../lib/loadFonts';
import commonStyles from './baseStyles/baseStyles';
import { getAccessToken, getRefreshToken, saveAccessToken } from './helpers/helpers';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { jwtDecode } from 'jwt-decode';
const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      await loadFonts();

      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        // 1. if no access and refresh token, go to login
        if (!accessToken && !refreshToken) {
          setLoading(false);
          return router.replace('/');
        }

        // 2. if access has not expired go to home
        if (accessToken) {
          try {
            const decoded: any = jwtDecode(accessToken);
            const currentTime = Math.floor(Date.now() / 1000);
            const isTokenExpired = decoded.exp < currentTime;

            if (!isTokenExpired) {
              // Token válido → entrar
              setLoading(false);
              return router.replace('/home');
            }
          } catch (e) {
            console.log('Error decoding access token, probablemente corrupto');
          }
        }

        // 3. if access token expired or not exists, but refresh token exists, refresh token.
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${API_URL}:${API_PORT}/api/auth/refresh`, { refreshToken });

            if (data.success) {
              await saveAccessToken(data.accessToken);
              setLoading(false);
              return router.replace('/home');
            }
          } catch (err) {
            console.log('Error al refrescar', err);
          }
        }

        // 4. No tokens, go to login
        router.replace('/');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Blessed Box',
        headerTitleStyle: commonStyles.title,
      }}
    />
  );
}
// TODO: Refactor screens
// <Stack>
//   <Stack.Screen name="home/index" options={{ title: 'Blessed Box', headerTitleStyle: commonStyles.title }} />
//   <Stack.Screen name="transactions/index" options={{ title: 'History', headerTitleStyle: commonStyles.title }} />
// </Stack>
