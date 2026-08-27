import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterHeader from '../components/auth/RegisterHeader';
import { authStyles } from '../baseStyles/authStyles';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={authStyles.registerScreen} edges={['top', 'left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
          style={authStyles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={authStyles.content}>
            <RegisterHeader />
            <RegisterForm onBackToLogin={() => router.back()} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
