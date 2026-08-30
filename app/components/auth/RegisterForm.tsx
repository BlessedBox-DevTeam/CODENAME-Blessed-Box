import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { authColors, authStyles } from '../../baseStyles/authStyles';

type RegisterFormProps = {
  onBackToLogin: () => void;
  onCreateAccount: (email: string) => void;
};

export default function RegisterForm({ onBackToLogin, onCreateAccount }: RegisterFormProps) {
  const { width, height } = useWindowDimensions();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const compact = height < 760;
  const veryCompact = height < 680;
  const horizontalPadding = width < 360 ? 22 : 30;
  const inputFontSize = veryCompact ? 15 : 17;
  const labelFontSize = veryCompact ? 13 : compact ? 14 : 15;
  const inputHeight = veryCompact ? 48 : compact ? 52 : 55;
  const inputRadius = veryCompact ? 17 : 20;
  const inputHorizontalPadding = veryCompact ? 17 : 20;
  const fieldSpacing = veryCompact ? 14 : compact ? 18 : 22;
  const termsTopSpacing = veryCompact ? 6 : compact ? 8 : 10;

  const canSubmit = Boolean(
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.length >= 8 &&
    password === confirmation &&
    termsAccepted
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[
        authStyles.registerForm,
        {
          maxWidth: 560,
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: horizontalPadding,
          paddingTop: veryCompact ? 16 : compact ? 20 : 26,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', marginBottom: fieldSpacing }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <RegisterField fontSize={labelFontSize} marginBottom={0} label="NAME">
            <TextInput
              style={[
                authStyles.registerInput,
                {
                  height: inputHeight,
                  borderRadius: inputRadius,
                  paddingHorizontal: inputHorizontalPadding,
                  marginTop: 0,
                  fontSize: inputFontSize,
                },
              ]}
              placeholder="Maria"
              placeholderTextColor="#A99A90"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </RegisterField>
        </View>

        <View style={{ flex: 1 }}>
          <RegisterField fontSize={labelFontSize} marginBottom={0} label="LAST NAME">
            <TextInput
              style={[
                authStyles.registerInput,
                {
                  height: inputHeight,
                  borderRadius: inputRadius,
                  paddingHorizontal: inputHorizontalPadding,
                  marginTop: 0,
                  fontSize: inputFontSize,
                },
              ]}
              placeholder="Gonzalez"
              placeholderTextColor="#A99A90"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </RegisterField>
        </View>
      </View>

      <RegisterField fontSize={labelFontSize} marginBottom={fieldSpacing} label="EMAIL">
        <TextInput
          style={[
            authStyles.registerInput,
            {
              height: inputHeight,
              borderRadius: inputRadius,
              paddingHorizontal: inputHorizontalPadding,
              marginTop: 0,
              fontSize: inputFontSize,
            },
          ]}
          placeholder="you@email.com"
          placeholderTextColor="#A99A90"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </RegisterField>

      <RegisterField fontSize={labelFontSize} marginBottom={fieldSpacing} label="PASSWORD">
        <PasswordInput
          value={password}
          placeholder="Minimum 8 characters"
          visible={showPassword}
          onChangeText={setPassword}
          onToggle={() => setShowPassword((previous) => !previous)}
          compact={compact}
          fontSize={inputFontSize}
          inputHeight={inputHeight}
          inputRadius={inputRadius}
          inputHorizontalPadding={inputHorizontalPadding}
        />
      </RegisterField>

      <RegisterField fontSize={labelFontSize} marginBottom={fieldSpacing} label="CONFIRM PASSWORD">
        <PasswordInput
          value={confirmation}
          placeholder="Repeat your password"
          visible={showConfirmation}
          onChangeText={setConfirmation}
          onToggle={() => setShowConfirmation((previous) => !previous)}
          compact={compact}
          fontSize={inputFontSize}
          inputHeight={inputHeight}
          inputRadius={inputRadius}
          inputHorizontalPadding={inputHorizontalPadding}
          onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        />
      </RegisterField>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setTermsAccepted((previous) => !previous)}
        style={[
          authStyles.registerTerms,
          compact && authStyles.registerTermsCompact,
          { marginTop: termsTopSpacing },
        ]}>
        <View style={[authStyles.termsBox, termsAccepted && authStyles.termsBoxChecked]}>
          {termsAccepted && <Text style={authStyles.termsCheck}>✓</Text>}
        </View>
        <Text
          style={[
            authStyles.termsText,
            {
              fontSize: veryCompact ? 13 : compact ? 14 : 16,
              lineHeight: veryCompact ? 19 : compact ? 21 : 23,
            },
          ]}>
          I accept the <Text style={authStyles.termsLink}>Terms and Conditions</Text> and the{' '}
          <Text style={authStyles.termsLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!canSubmit}
        onPress={() => onCreateAccount(email)}
        style={[
          authStyles.registerButton,
          compact && authStyles.registerButtonCompact,
          canSubmit && authStyles.registerButtonActive,
        ]}>
        <Text
          style={[
            authStyles.registerButtonText,
            { fontSize: veryCompact ? 16 : compact ? 17 : 18 },
            canSubmit && authStyles.registerButtonTextActive,
          ]}>
          Create account <Text style={authStyles.registerButtonArrow}>→</Text>
        </Text>
      </TouchableOpacity>

      <View style={[authStyles.loginPrompt, compact && authStyles.loginPromptCompact]}>
        <Text style={[authStyles.loginPromptText, { fontSize: labelFontSize + 1 }]}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onBackToLogin}>
          <Text style={[authStyles.loginPromptAction, { fontSize: labelFontSize + 1 }]}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function RegisterField({
  label,
  children,
  fontSize,
  marginBottom,
}: {
  label: string;
  children: React.ReactNode;
  fontSize: number;
  marginBottom: number;
}) {
  return (
    <View style={[authStyles.registerField, { marginBottom }]}>
      <Text style={[authStyles.label, { fontSize, marginBottom: 5 }]}>{label}</Text>
      {children}
    </View>
  );
}

function PasswordInput({
  value,
  placeholder,
  visible,
  onChangeText,
  onToggle,
  compact,
  fontSize,
  inputHeight,
  inputRadius,
  inputHorizontalPadding,
  onFocus,
}: {
  value: string;
  placeholder: string;
  visible: boolean;
  onChangeText: (value: string) => void;
  onToggle: () => void;
  compact: boolean;
  fontSize: number;
  inputHeight: number;
  inputRadius: number;
  inputHorizontalPadding: number;
  onFocus?: () => void;
}) {
  return (
    <View
      style={[
        authStyles.registerPassword,
        {
          height: inputHeight,
          borderRadius: inputRadius,
          paddingLeft: inputHorizontalPadding,
          paddingRight: compact ? 14 : 18,
          marginTop: 0,
        },
      ]}>
      <TextInput
        style={[authStyles.registerPasswordInput, { fontSize }]}
        placeholder={placeholder}
        placeholderTextColor="#A99A90"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        autoCapitalize="none"
        onFocus={onFocus}
      />
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={onToggle}
        style={authStyles.passwordToggle}
        hitSlop={8}>
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={25}
          color={authColors.mutedText}
        />
      </TouchableOpacity>
    </View>
  );
}
