import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CircularProgress from "../components/circularProgress";
import commonStyles from "../baseStyles/baseStyles";
import colors from "../baseStyles/colors";
import { Stack, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const handleQrCodePress = () => {
    return router.replace("./qrCode");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: colors.backgroundColor, flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, paddingVertical: 0, paddingHorizontal: 20 }}
        >
          <View style={[commonStyles.card, commonStyles.gridContainer]}>
            <View style={commonStyles.leftColumn}>
              <Text
                style={[
                  commonStyles.paragraphExtraBold,
                  { color: colors.green_label, gap: 0.5 }
                ]}
              >
                OCC{" "}
                <Text
                  style={[
                    commonStyles.paragraphExtraBold,
                    { color: colors.red_label }
                  ]}
                >
                  2025
                </Text>
              </Text>
              <Text style={commonStyles.header}>Yearly Goal</Text>
              <Text style={commonStyles.paragraph}>
                Boxes Collected:{" "}
                <Text style={commonStyles.paragraphExtraBold}>6,000</Text>{" "}
              </Text>
              <Text style={commonStyles.paragraph}>
                Reaching Point: 12,000 Boxes
              </Text>
            </View>
            <View style={commonStyles.rightColumn}>
              <CircularProgress percentage={50} />
            </View>
          </View>
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 16 }]}>
            <Text style={commonStyles.header}>Your Contribution</Text>
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
              You have deposited a total of
              <Text style={commonStyles.paragraphExtraBold}> 45 </Text>boxes
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  backgroundColor: colors.green_label,
                  width: 50,
                  flex: 1,
                  alignItems: "center",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10
                }}
              >
                <Text style={[commonStyles.header, { color: colors.white }]}>
                  15
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.red_label,
                  width: 50,
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <Text style={[commonStyles.header, { color: colors.white }]}>
                  15
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.light_gray,
                  width: 50,
                  flex: 1,
                  alignItems: "center",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10
                }}
              >
                <Text
                  style={[commonStyles.header, { color: colors.dark_gray }]}
                >
                  15
                </Text>
              </View>
            </View>
            <Text style={commonStyles.paragraph}>
              Great job! Keep it going!
            </Text>
            <TouchableOpacity
              style={[
                commonStyles.buttonNoShadow,
                { backgroundColor: colors.dark_blue }
              ]}
              onPress={() => alert("Add more boxes!")}
            >
              <Text
                style={[commonStyles.paragraphBold, { color: colors.white }]}
              >
                View Activity
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[commonStyles.card, { marginTop: 20, rowGap: 16 }]}>
            <Text style={commonStyles.header}>Your Church</Text>
            <Text style={[commonStyles.paragraph, { fontSize: 12 }]}>
              Rejoice in the Lord always: and again I say, Rejoice.{" "}
              <Text style={[commonStyles.paragraph, { fontSize: 10 }]}>
                (Philippians 4:4){" "}
              </Text>
            </Text>
            <Text style={commonStyles.paragraph}>
              Iglesia Cristiana Bethlehem has collected{" "}
              <Text style={commonStyles.paragraphExtraBold}>10,000</Text> boxes
            </Text>
            <Text
              style={[
                commonStyles.paragraphBold,
                { color: colors.dark_blue, alignSelf: "flex-end" }
              ]}
            >
              See details
            </Text>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text
            style={[commonStyles.paragraph, { flex: 1, textAlign: "center" }]}
          >
            Dashboard
          </Text>
          <Text
            style={[commonStyles.paragraph, { flex: 1, textAlign: "center" }]}
          >
            News
          </Text>
          <Text
            style={[commonStyles.paragraph, { flex: 1, textAlign: "center" }]}
            onPress={handleQrCodePress}
          >
            QR
          </Text>
          <Text
            style={[commonStyles.paragraph, { flex: 1, textAlign: "center" }]}
          >
            History
          </Text>
          <Text
            style={[commonStyles.paragraph, { flex: 1, textAlign: "center" }]}
          >
            Centers
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
