import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

export default function Index({}) {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();
  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1, padding: 16, justifyContent: 'center' }}>
        <View style={[commonStyles.card, { height: 'auto', gap: 16, justifyContent: 'center', alignItems: 'center' }]}>
          <Image source={require('../../assets/images/favicon.png')} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
          <Text style={[commonStyles.header, { textAlign: 'center', fontSize: 22 }]}>
            Order #{transactionId} {'\n'}has been received
          </Text>
          <Text style={[commonStyles.paragraph, { textAlign: 'center' }]}>Thank you for your donation. A child will be blessed because of your gift.</Text>
          <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center' }]}>Blessed Box</Text>
          <TouchableOpacity
            style={[commonStyles.buttonNoShadow]}
            onPress={() => {
              router.replace('/(protected)/home');
            }}>
            <Text style={[commonStyles.header, { color: colors.white }]}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
