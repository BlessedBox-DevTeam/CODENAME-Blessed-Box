import axios from 'axios';
import Constants from 'expo-constants';
import { Stack, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Church from '../components/icons/Church';
import DepositHistory from '../components/icons/DepositHistory';
import Home from '../components/icons/Home';
import Newspaper from '../components/icons/NewsPaper';
import QRCode from '../components/icons/QRCode';
import { deleteAccessToken, deleteRefreshToken, getRefreshToken } from '../helpers/helpers';
const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;

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
    const refreshToken = getRefreshToken();
    const { success } = (await axios.post(`${API_URL}:${API_PORT}/api/auth/logout`, { refreshToken })).data;
    if (success) {
      deleteAccessToken();
      deleteRefreshToken();
      router.replace('/login');
    }
  };

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
                <Button
                  onPress={() => {
                    // Aquí defines la acción de salir
                    Alert.alert('Salir', '¿Quieres cerrar la aplicación?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Salir', onPress: () => exit() },
                    ]);
                  }}
                  title="Exit"
                  color="#FF0000"
                />
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
                <Button
                  onPress={() => {
                    Alert.alert('Salir', '¿Quieres cerrar la aplicación?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Salir', onPress: () => exit() },
                    ]);
                  }}
                  title="Exit"
                  color="#FF0000"
                />
              ),
            }}
          />
        </Stack>
      </View>

      {/* Bottom Tab Manual */}

      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.white,
          }}>
          {/* Home */}
          <Pressable onPress={() => handleNavigate('/home')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Home width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Home</Text>
          </Pressable>

          {/* News */}
          <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Newspaper width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>News</Text>
          </Pressable>

          {/* QRCode */}
          <Pressable onPress={() => handleNavigate('/qrCode/qrCode')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <QRCode width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>QR</Text>
          </Pressable>

          {/* DepositHistory */}
          <Pressable onPress={() => handleNavigate('/transactions')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <DepositHistory width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>History</Text>
          </Pressable>

          {/* Centers */}
          <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Church width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Centers</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
