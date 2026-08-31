import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { authStyles } from '../baseStyles/authStyles';
import AuthErrorModal from '../components/auth/AuthErrorModal';
import AuthHeader from '../components/auth/AuthHeader';
import LoginForm from '../components/auth/LoginForm';
import LoadingOverlay from '../components/LoadingSpinner';
import { saveAccessToken } from '../helpers/helpers';
import { login } from '../services/services';
import { initSocket } from '../socketService';

const extra = Constants.expoConfig?.extra;

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await login(email, password);

      if (!response.data.success) {
        setErrorVisible(true);
        return;
      }

      await saveAccessToken(response.data.accessToken);
      await initSocket();
      router.replace('/home');
    } catch (error) {
      console.log('Login error:', error);
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={authStyles.screen} edges={['top', 'left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingOverlay visible={isLoading} />
        <AuthErrorModal visible={errorVisible} onClose={() => setErrorVisible(false)} />

        <KeyboardAvoidingView
          style={authStyles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={authStyles.content}>
            <AuthHeader />
            <LoginForm
              onSubmit={handleLogin}
              onInvalid={() => setErrorVisible(true)}
              onRegister={() => router.push('/register')}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
