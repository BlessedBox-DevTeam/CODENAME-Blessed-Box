import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { validateLoginInputs } from '../../helpers/authValidation';
import { authColors, authStyles } from '../../baseStyles/authStyles';
import { forgotPassword } from '@/app/services/services';

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  onInvalid: () => void;
  onRegister: () => void;
};

export default function LoginForm({ onSubmit, onInvalid, onRegister }: LoginFormProps) {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const compact = height < 750;
  const veryCompact = height < 680;
  const horizontalPadding = width < 360 ? 22 : 30;
  const inputHeight = veryCompact ? 48 : compact ? 52 : 55;
  const buttonHeight = veryCompact ? 51 : compact ? 55 : 58;
  const fontSize = veryCompact ? 15 : 17;

  const handleSubmit = () => {
    const { valid } = validateLoginInputs(email, password);
    if (valid) {
      onSubmit(email, password);
    } else {
      onInvalid();
    }
  };
  const handleForgotPassword = async () => {
    const { success } = (await forgotPassword(email)).data;
  };

  return (
    <View
      style={[
        authStyles.form,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: veryCompact ? 15 : compact ? 18 : 24,
        },
      ]}>
      <Text style={[styles.welcome, { fontSize: veryCompact ? 27 : compact ? 30 : 34 }]}>
        Welcome back!
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            fontSize: veryCompact ? 15 : compact ? 16 : 18,
            marginBottom: veryCompact ? 12 : compact ? 16 : 22,
          },
        ]}>
        Sign in to view your donations
      </Text>

      <Text
        style={[
          authStyles.label,
          { fontSize: veryCompact ? 13 : 15, marginBottom: veryCompact ? 5 : 7 },
        ]}>
        EMAIL
      </Text>
      <TextInput
        style={[
          authStyles.input,
          {
            height: inputHeight,
            borderRadius: veryCompact ? 17 : 20,
            paddingHorizontal: veryCompact ? 17 : 20,
            fontSize,
            marginBottom: veryCompact ? 11 : compact ? 14 : 18,
          },
        ]}
        placeholder="you@email.com"
        placeholderTextColor={authColors.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <Text
        style={[
          authStyles.label,
          { fontSize: veryCompact ? 13 : 15, marginBottom: veryCompact ? 5 : 7 },
        ]}>
        PASSWORD
      </Text>
      <View
        style={[
          authStyles.passwordContainer,
          {
            height: inputHeight,
            borderRadius: veryCompact ? 17 : 20,
            paddingLeft: veryCompact ? 17 : 20,
            paddingRight: veryCompact ? 14 : 18,
            marginBottom: veryCompact ? 10 : 14,
          },
        ]}>
        <TextInput
          style={[authStyles.passwordInput, { fontSize }]}
          placeholder="password"
          placeholderTextColor={authColors.placeholder}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => setShowPassword((previous) => !previous)}
          hitSlop={8}
          style={authStyles.passwordToggle}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={25}
            color={authColors.mutedText}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleForgotPassword}
        style={[authStyles.forgotPassword, { marginBottom: veryCompact ? 11 : compact ? 15 : 20 }]}>
        <Text style={[authStyles.forgotPasswordText, { fontSize: veryCompact ? 13 : 15 }]}>
          Forgot your password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        style={[
          authStyles.submitButton,
          {
            height: buttonHeight,
            borderRadius: veryCompact ? 18 : 21,
            marginBottom: veryCompact ? 11 : compact ? 15 : 20,
          },
        ]}>
        <Text style={[authStyles.submitText, { fontSize: veryCompact ? 17 : 20 }]}>Sign in</Text>
        <Text
          style={[
            authStyles.submitArrow,
            { fontSize: veryCompact ? 27 : 31, lineHeight: veryCompact ? 29 : 33 },
          ]}>
          →
        </Text>
      </TouchableOpacity>

      <View style={authStyles.registerLink}>
        <Text style={[authStyles.registerText, { fontSize: veryCompact ? 14 : 16 }]}>
          Don&apos;t have an account?{' '}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onRegister}>
          <Text style={[authStyles.registerAction, { fontSize: veryCompact ? 14 : 16 }]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  welcome: {
    lineHeight: 38,
    fontWeight: '900' as const,
    letterSpacing: -0.8,
    color: authColors.text,
    marginBottom: 5,
  },
  subtitle: {
    color: authColors.mutedText,
  },
};
