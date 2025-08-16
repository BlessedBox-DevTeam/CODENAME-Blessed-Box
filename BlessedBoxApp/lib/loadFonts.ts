// lib/loadFonts.ts
import * as Font from 'expo-font';

export async function loadFonts() {
  try {
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
      'OpenSans-ExtraBold': require('../assets/fonts/OpenSans-ExtraBold.ttf'),
      'OpenSans-SemiBoldItalic': require('../assets/fonts/OpenSans-SemiBoldItalic.ttf'),
      'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
      'PlayfairDisplay-Black': require('../assets/fonts/PlayfairDisplay-Black.ttf'),
    });
    console.log('Fonts cargadas ✅');
  } catch (error) {
    console.warn('Error cargando fonts:', error);
  }
}
