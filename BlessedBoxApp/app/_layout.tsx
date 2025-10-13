import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { loadFonts } from '../lib/loadFonts';
import commonStyles from './baseStyles/baseStyles';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      await loadFonts();
      setFontsLoaded(true);
    }
    load();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="home/index" options={{ title: 'Blessed Box', headerTitleStyle: commonStyles.title }} />
      <Stack.Screen name="transactions/index" options={{ title: 'History', headerTitleStyle: commonStyles.title }} />
    </Stack>
  );
}
