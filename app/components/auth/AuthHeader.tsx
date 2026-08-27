import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { authColors, authStyles } from '../../baseStyles/authStyles';

export default function AuthHeader() {
  const { height } = useWindowDimensions();
  const compact = height < 750;
  const veryCompact = height < 680;
  const logoSize = veryCompact ? 82 : compact ? 92 : 105;
  const iconSize = veryCompact ? 45 : compact ? 50 : 58;
  const titleSize = veryCompact ? 28 : compact ? 31 : 34;
  const sloganSize = veryCompact ? 14 : compact ? 15 : 17;
  const headerHeight = veryCompact ? '31%' : compact ? '32%' : '34%';

  return (
    <View style={[authStyles.header, { height: headerHeight, backgroundColor: authColors.header }]}>
      <View style={[styles.circle, styles.firstCircle, compact && styles.compactFirstCircle]} />
      <View style={[styles.circle, styles.secondCircle, compact && styles.compactSecondCircle]} />
      <View style={[styles.circle, styles.thirdCircle, compact && styles.compactThirdCircle]} />

      <View
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: compact ? 28 : 32,
            marginBottom: compact ? 9 : 13,
          },
        ]}>
        <MaterialCommunityIcons name="gift" size={iconSize} color={authColors.primary} />
      </View>

      <Text style={[styles.title, { fontSize: titleSize, marginBottom: veryCompact ? 3 : 6 }]}>
        BlessedBox
      </Text>
      <Text style={[styles.slogan, { fontSize: sloganSize }]}>
        Each box counts. Every child matters.
      </Text>
    </View>
  );
}

const styles = {
  circle: {
    position: 'absolute' as const,
    borderRadius: 100,
  },
  firstCircle: {
    width: 95,
    height: 95,
    top: 55,
    left: 42,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondCircle: {
    width: 125,
    height: 125,
    top: 48,
    right: 62,
    backgroundColor: 'rgba(203,83,38,0.12)',
  },
  thirdCircle: {
    width: 65,
    height: 65,
    top: 120,
    right: 30,
    backgroundColor: 'rgba(203,83,38,0.12)',
  },
  compactFirstCircle: { width: 75, height: 75, top: 35 },
  compactSecondCircle: { width: 105, height: 105, top: 30 },
  compactThirdCircle: { width: 55, height: 55, top: 92 },
  logo: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: authColors.white,
    shadowColor: '#8E4D2D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontWeight: '900' as const,
    letterSpacing: -1,
    color: authColors.text,
  },
  slogan: {
    fontWeight: '600' as const,
    color: '#8E6B52',
    textAlign: 'center' as const,
  },
};
