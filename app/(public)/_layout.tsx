import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppLoadingScreen from '../components/auth/AppLoadingScreen';
import { getAccessToken } from '../helpers/helpers';
import { jwtDecode } from 'jwt-decode';

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
      if (accessToken) {
        try {
          const decoded: any = jwtDecode(accessToken);
          const now = Math.floor(Date.now() / 1000);
          authenticated = decoded.exp > now;
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
    </Stack>
  );
}
