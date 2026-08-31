import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OtpInput from '../components/auth/OtpInput';
import { deletePendingRegistrationEmail, getPendingRegistrationEmail } from '../helpers/helpers';
import { resendOTP, verifyOTP } from '../services/services';

const OTP_LENGTH = 6;

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const maskedEmail = useMemo(() => {
    if (!email) return 'your email';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const visible = localPart.slice(0, 2);
    const hidden = '*'.repeat(Math.max(localPart.length - visible.length, 1));
    return `${visible}${hidden}@${domain}`;
  }, [email]);

  const handleChangeOtp = (text: string) => {
    setOtp(text);
  };

  const handleSubmit = async () => {
    const finalEmail = email || (await getPendingRegistrationEmail()) || '';

    if (!finalEmail || otp.length !== OTP_LENGTH) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await verifyOTP(finalEmail, otp);

      if (response.data?.success) {
        await deletePendingRegistrationEmail();
        router.replace('/login');
        return;
      }

      alert(response.data?.message || 'The code is invalid. Please try again.');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Unable to verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const pendingEmail = email || (await getPendingRegistrationEmail()) || '';

    if (!pendingEmail) {
      return;
    }

    try {
      await resendOTP(pendingEmail);
      alert('A new verification code has been sent.');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Unable to resend the code.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.headerWrap}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <View style={styles.titleRow}>
              <View style={styles.iconBadge}>
                <Text style={styles.icon}>✓</Text>
              </View>
              <View style={styles.titleBlock}>
                <Text style={styles.title}>Verification</Text>
                <Text style={styles.subtitle}>Security code</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>We sent a 6-digit code to</Text>
            <Text style={styles.email}>{maskedEmail}</Text>

            <OtpInput value={otp} length={OTP_LENGTH} onChangeText={handleChangeOtp} autoFocus />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSubmit}
              disabled={isLoading || otp.length !== OTP_LENGTH}
              style={[
                styles.submitButton,
                (isLoading || otp.length !== OTP_LENGTH) && styles.submitButtonDisabled,
              ]}>
              <Text style={styles.submitText}>
                {isLoading ? 'Verifying...' : 'Enter the remaining 6 digits'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
              <Text style={styles.resendIcon}>↻</Text>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              ¿Didn't receive the email? Check your spam folder.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3A36E',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3A36E',
  },
  headerWrap: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#F3A36E',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 22,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#F7F2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
    color: '#D95727',
    fontWeight: '900',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#FDE7DA',
    fontSize: 14,
    marginTop: 2,
  },
  body: {
    flex: 1,
    backgroundColor: '#F6F0EB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 32,
    alignItems: 'center',
  },
  label: {
    color: '#6F5142',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    color: '#221710',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 28,
  },
  otpBox: {
    width: '100%',
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  digitCell: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#F0E5DD',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitCellFilled: {
    borderColor: '#D8C2B1',
  },
  digitCellActive: {
    borderColor: '#D95727',
  },
  digitText: {
    color: '#2B211C',
    fontSize: 28,
    fontWeight: '700',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#D95727',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#D95727',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 8,
  },
  resendIcon: {
    color: '#5F4A3C',
    fontSize: 18,
    fontWeight: '700',
  },
  resendText: {
    color: '#5F4A3C',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    color: '#6E5648',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
});
