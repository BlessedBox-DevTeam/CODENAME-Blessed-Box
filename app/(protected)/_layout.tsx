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
import { deleteAccessToken, deleteRefreshToken, getAccessToken } from '../helpers/helpers';
import { logout } from '../services/services';
import { disconnectSocket, initSocket } from '../socketService';

export default function ProtectedLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isOrderDetail = pathname === '/depositDetails';

  const isTabActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    if (path === '/qrCode/qrCode') {
      router.push(path);
    } else {
      router.replace(path);
    }
  };
  const exit = async () => {
    const { success } = (await logout()).data;
    if (success) {
      deleteAccessToken();
      deleteRefreshToken();
      disconnectSocket();
      router.replace('/login');
    }
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

      {!isOrderDetail && (
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.white,
            position: 'relative',
            paddingTop: 0,
            paddingBottom: 0,
          }}>
          <LinearGradient
            colors={[colors.overlayLight, colors.transparent]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 10 }}
          />

          {/* Home */}
          <Pressable
            onPress={() => handleNavigate('/home')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isTabActive('/home') ? colors.tabHighlight : colors.transparent,
              borderRadius: 12,
              paddingVertical: 4,
              marginHorizontal: 4,
            }}>
            <Home
              width={24}
              height={24}
              color={isTabActive('/home') ? colors.dark_blue : colors.dark_gray}
            />
            <Text
              style={[
                commonStyles.paragraph,
                { fontSize: 10, color: isTabActive('/home') ? colors.dark_blue : colors.dark_gray },
              ]}>
              Home
            </Text>
          </Pressable>

          {/* News */}
          <Pressable
            disabled
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.45,
              borderRadius: 12,
              paddingVertical: 2,
              marginHorizontal: 4,
            }}>
            <Newspaper width={24} height={24} color={colors.dark_gray} />
            <Text style={[commonStyles.paragraph, { fontSize: 10, color: colors.dark_gray }]}>
              News
            </Text>
          </Pressable>

          {/* QRCode */}
          <Pressable
            onPress={() => handleNavigate('/qrCode/qrCode')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              paddingVertical: 4,
              marginHorizontal: 4,
            }}>
            <QRCode width={24} height={24} />
            <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>QR</Text>
          </Pressable>

          {/* DepositHistory */}
          <Pressable
            onPress={() => handleNavigate('/transactions')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isTabActive('/transactions')
                ? colors.tabHighlight
                : colors.transparent,
              borderRadius: 12,
              paddingVertical: 4,
              marginHorizontal: 4,
            }}>
            <DepositHistory
              width={24}
              height={24}
              color={isTabActive('/transactions') ? colors.dark_blue : colors.dark_gray}
            />
            <Text
              style={[
                commonStyles.paragraph,
                {
                  fontSize: 10,
                  color: isTabActive('/transactions') ? colors.dark_blue : colors.dark_gray,
                },
              ]}>
              History
            </Text>
          </Pressable>

          {/* Centers */}
          <Pressable
            disabled
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.45,
              borderRadius: 12,
              paddingVertical: 2,
              marginHorizontal: 4,
            }}>
            <Church width={24} height={24} color={colors.dark_gray} />
            <Text style={[commonStyles.paragraph, { fontSize: 10, color: colors.dark_gray }]}>
              Centers
            </Text>
          </Pressable>
        </SafeAreaView>
      )}
    </>
  );
}
