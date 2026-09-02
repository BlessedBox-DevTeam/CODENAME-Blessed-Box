import { LinearGradient } from 'expo-linear-gradient';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Church from '../components/icons/Church';
import DepositHistory from '../components/icons/DepositHistory';
import Home from '../components/icons/Home';
import Newspaper from '../components/icons/NewsPaper';
import QRCode from '../components/icons/QRCode';
import SignOut from '../components/icons/SignOut';
import { getAccessToken } from '../helpers/helpers';
import { logout } from '../services/services';
import { disconnectSocket, initSocket } from '../socketService';

export default function ProtectedLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    if (path === '/qrCode/qrCode') {
      router.push(path);
    } else {
      router.replace(path);
    }
  };
  const exit = async () => {
    const success = await logout();
    if (success) router.replace('/login');
  };
  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      if (token) {
        await initSocket();
      }
    };
    init();

    return () => disconnectSocket();
  }, []);

  return (
    <>
      {/* Stack de pantallas */}
      <View style={{ flex: 1, height: '100%' }}>
        <Stack>
          <Stack.Screen
            name="home"
            options={{
              title: 'Blessed Box',
              headerTitleStyle: commonStyles.title,
              headerBackVisible: false,
              headerRight: () => (
                <Pressable
                  onPress={() => {
                    Alert.alert('Salir', '¿Quieres cerrar la aplicación?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Salir', onPress: () => exit() },
                    ]);
                  }}>
                  <SignOut height={30} width={30}></SignOut>
                </Pressable>
              ),
            }}
          />

          <Stack.Screen
            name="transactions"
            options={{
              title: 'History',
              headerTitleStyle: commonStyles.title,
              headerBackVisible: false,
              headerRight: () => (
                <Pressable
                  onPress={() => {
                    Alert.alert('Salir', '¿Quieres cerrar la aplicación?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Salir', onPress: () => exit() },
                    ]);
                  }}>
                  <SignOut height={30} width={30}></SignOut>
                </Pressable>
              ),
            }}
          />
        </Stack>
      </View>

      {/* Bottom Tab Manual */}

      <SafeAreaView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: colors.white,
          position: 'relative',
        }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, zIndex: 10 }}
        />

        {/* Home */}
        <Pressable
          onPress={() => handleNavigate('/home')}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Home width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Home</Text>
        </Pressable>

        {/* News */}
        <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Newspaper width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>News</Text>
        </Pressable>

        {/* QRCode */}
        <Pressable
          onPress={() => handleNavigate('/qrCode/qrCode')}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <QRCode width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>QR</Text>
        </Pressable>

        {/* DepositHistory */}
        <Pressable
          onPress={() => handleNavigate('/transactions')}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DepositHistory width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>History</Text>
        </Pressable>

        {/* Centers */}
        <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Church width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Centers</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
