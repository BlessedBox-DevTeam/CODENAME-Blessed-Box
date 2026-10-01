import { Stack, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppLoadingScreen from '../components/auth/AppLoadingScreen';
import { getAccessToken } from '../helpers/helpers';
import { refreshAccessToken } from '../services/api';

export default function LoginLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      let authenticated = false;
      console.log('Before SecureStore');

      if (Platform.OS === 'web') {
        // return localStorage.getItem(key);
        setCheckingAuth(false);
      }
      const accessToken = await getAccessToken();
      console.log('After SecureStore');
      if (accessToken) {
        try {
          console.log('After getAccessToken');
          const decoded: any = jwtDecode(accessToken);
          const now = Math.floor(Date.now() / 1000);
          authenticated = decoded.exp > now;
        } catch {
          authenticated = false;
        }
      }
      if (!authenticated) {
        try {
          console.log('After refreshAccessToken');
          await refreshAccessToken();
          authenticated = true;
        } catch {
          authenticated = false;
        }
      }

      if (authenticated) {
        console.log('After both tokens');
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
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFF8F1' },
      }}>
      <Stack.Screen
        name="login"
        options={{
          animation: 'slide_from_right',
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
