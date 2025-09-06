import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { loadFonts } from '../lib/loadFonts';
import commonStyles from './baseStyles/baseStyles';
import { View, Text } from 'react-native';
import React from 'react';

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
        <Text> Cargando fuentes...</Text>
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
