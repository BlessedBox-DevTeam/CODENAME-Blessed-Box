import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterHeader from '../components/auth/RegisterHeader';
import { authStyles } from '../baseStyles/authStyles';
import { savePendingRegistrationEmail } from '../helpers/helpers';
import { register } from '../services/services';

export default function RegisterScreen() {
  const router = useRouter();

  const handleCreateAccount = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    const { success } = (await register(firstName, lastName, email, password)).data;
    if (success) {
      await savePendingRegistrationEmail(email);
      router.push({ pathname: '/verification', params: { email } });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={authStyles.registerScreen} edges={['top', 'left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
          style={authStyles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={authStyles.content}>
            <RegisterHeader />
            <RegisterForm
              onBackToLogin={() => router.back()}
              onCreateAccount={handleCreateAccount}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
