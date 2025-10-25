import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return <Slot />;
}
