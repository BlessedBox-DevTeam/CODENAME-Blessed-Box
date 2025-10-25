import { Stack, useRouter, Href } from 'expo-router';
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import Home from '../components/icons/Home';
import Newspaper from '../components/icons/NewsPaper';
import QRCode from '../components/icons/QRCode';
import DepositHistory from '../components/icons/DepositHistory';
import Church from '../components/icons/Church';

export default function ProtectedLayout() {
  const router = useRouter();

  return (
    <>
      {/* Stack de pantallas */}
      <Stack>
        <Stack.Screen name="home" options={{ title: 'Blessed Box', headerTitleStyle: commonStyles.title }} />
        <Stack.Screen name="transactions" options={{ title: 'History', headerTitleStyle: commonStyles.title }} />
      </Stack>

      {/* Bottom Tab Manual */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 8,
          backgroundColor: colors.white,
        }}>
        {/* Home */}
        <Pressable onPress={() => router.replace('/home' as Href)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Home width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Home</Text>
        </Pressable>

        {/* News */}
        <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Newspaper width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>News</Text>
        </Pressable>

        {/* QRCode */}
        <Pressable onPress={() => router.replace('/qrCode' as Href)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <QRCode width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>QR</Text>
        </Pressable>

        {/* DepositHistory */}
        <Pressable onPress={() => router.replace('/transactions' as Href)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DepositHistory width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>History</Text>
        </Pressable>

        {/* Centers */}
        <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Church width={24} height={24} />
          <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>Centers</Text>
        </Pressable>
      </View>
    </>
  );
}
