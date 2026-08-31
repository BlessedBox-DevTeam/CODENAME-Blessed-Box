import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import AppLoadingScreen from './components/auth/AppLoadingScreen';
import { loadFonts } from '../lib/loadFonts';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      await loadFonts();
      setFontsLoaded(true);
    }
    init();
  }, []);

  if (!fontsLoaded) {
    return <AppLoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF8F1' }}>
      <Slot />
    </View>
  );
}
