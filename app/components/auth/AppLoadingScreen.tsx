import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { authColors, authStyles } from '../../baseStyles/authStyles';

export default function AppLoadingScreen() {
  return (
    <View style={authStyles.loadingScreen}>
      <View style={[authStyles.loadingShape, authStyles.loadingShapeLarge]} />
      <View style={[authStyles.loadingShape, authStyles.loadingShapeSmall]} />

      <View style={authStyles.loadingContent}>
        <View style={authStyles.loadingLogo}>
          <MaterialCommunityIcons name="gift" size={54} color={authColors.primary} />
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
