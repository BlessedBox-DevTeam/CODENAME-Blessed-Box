import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { authColors, authStyles } from '../../baseStyles/authStyles';
import GiftBoxIcon from '../icons/GiftBoxIcon';

export default function AppLoadingScreen() {
  return (
    <View style={authStyles.loadingScreen}>
      <View style={[authStyles.loadingShape, authStyles.loadingShapeLarge]} />
      <View style={[authStyles.loadingShape, authStyles.loadingShapeSmall]} />

      <View style={authStyles.loadingContent}>
        <View style={authStyles.loadingLogo}>
          <GiftBoxIcon size={54} />
        </View>
        <Text style={authStyles.loadingBrand}>BlessedBox</Text>
        <ActivityIndicator
          size="small"
          color={authColors.primary}
          style={authStyles.loadingIndicator}
        />
      </View>
    </View>
  );
}
