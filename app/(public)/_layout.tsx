import { Stack, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppLoadingScreen from '../components/auth/AppLoadingScreen';
import { getAccessToken, getRefreshToken, saveAccessToken } from '../helpers/helpers';
import { refreshTokens } from '../services/services';

export default function LoginLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      let authenticated = false;

      if (Platform.OS === 'web') {
        // return localStorage.getItem(key);
        setCheckingAuth(false);
      }
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
          const response = await refreshTokens(refreshToken);
          const data = response.data;
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
  }, [router]);

  if (checkingAuth) {
    return <AppLoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          animation: 'none',
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          animation: 'slide_from_left',
        }}
      />

      <Stack.Screen
        name="verification"
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
