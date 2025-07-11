import { Stack } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import commonStyles from "../baseStyles/baseStyles";
import colors from "../baseStyles/colors";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{ backgroundColor: colors.backgroundColor, flex: 1 }}
      >
        <View>
          <Text>{`${"Placeholder Back"}`}</Text>
          <Text style={commonStyles.header}>Qr Code</Text>
        </View>
        <View>
          <Text>Scan QR</Text>
          <Text>Manual Code</Text>
        </View>
        <View>
          <CameraView
            style={{
              width: "100%",
              height: "100%"
            }}
            facing={facing}
          ></CameraView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
