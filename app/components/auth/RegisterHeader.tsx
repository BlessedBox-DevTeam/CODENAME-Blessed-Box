import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { authColors, authStyles } from '../../baseStyles/authStyles';

export default function RegisterHeader() {
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const veryCompact = height < 680;
  const headerHeight = Math.min(height * 0.2, 170);

  return (
    <>
      <View
        style={[
          authStyles.registerHeader,
          compact && authStyles.registerHeaderCompact,
          veryCompact && authStyles.registerHeaderVeryCompact,
          { height: headerHeight },
        ]}>
        <View style={[authStyles.registerBrand, compact && authStyles.registerBrandCompact]}>
          <View style={[authStyles.registerLogo, compact && authStyles.registerLogoCompact]}>
            <MaterialCommunityIcons
              name="gift"
              size={veryCompact ? 24 : compact ? 28 : 32}
              color={authColors.primary}
            />
          </View>
          <Text
            style={[authStyles.registerBrandName, compact && authStyles.registerBrandNameCompact]}>
            BlessedBox
          </Text>
        </View>
        <Text style={[authStyles.registerTitle, compact && authStyles.registerTitleCompact]}>
          Create your account
        </Text>
        <Text style={[authStyles.registerSubtitle, compact && authStyles.registerSubtitleCompact]}>
          Join our community of donors
        </Text>
      </View>
      <View style={[authStyles.benefits, compact && authStyles.benefitsCompact]}>
        <Benefit compact={compact} text="Register gift boxes" />
        <Benefit compact={compact} text="Donation history" />
        <Benefit compact={compact} text="Real-time impact" />
      </View>
    </>
  );
}

function Benefit({ text, compact }: { text: string; compact: boolean }) {
  return (
    <View style={[authStyles.benefit, compact && authStyles.benefitCompact]}>
      <Text style={authStyles.benefitCheck}>✓</Text>
      <Text style={[authStyles.benefitText, compact && authStyles.benefitTextCompact]}>{text}</Text>
    </View>
  );
}
