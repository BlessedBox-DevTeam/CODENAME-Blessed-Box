import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import commonStyles from "../baseStyles/baseStyles";
import colors from "../baseStyles/colors";

const BoxLabel = () => {
  return (
    <View style={[commonStyles.card, { gap: 10 }]}>
      <Text
        style={[
          commonStyles.header,
          { color: colors.red, textTransform: "uppercase" }
        ]}
      >
        Shoebox Label
      </Text>
      <View
        style={{
          backgroundColor: colors.red_label,
          width: "100%",
          borderRadius: 10,
          padding: 10
        }}
      >
        <Text
          style={[
            commonStyles.paragraphExtraBold,
            { color: colors.white, textTransform: "uppercase" }
          ]}
        >
          Girl
        </Text>
      </View>
      <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
        Select Age
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: colors.light_gray,
          alignItems: "center",
          borderRadius: 5,
          padding: 2,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            borderRadius: 5,
            backgroundColor: colors.white,
            padding: 10,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>
            2-4
          </Text>
        </View>
        <View
          style={{
            borderRadius: 5,
            // backgroundColor: colors.white,
            padding: 10,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={[commonStyles.paragraph, { letterSpacing: 2 }]}>
            5-9
          </Text>
        </View>
        <View
          style={{
            borderRadius: 5,
            // backgroundColor: colors.white,
            padding: 10,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <Text style={commonStyles.paragraph}>
            10<Text style={{ letterSpacing: 2 }}>-</Text>14
          </Text>
        </View>
      </View>
      <Text style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}>
        Quantity
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          padding: 2,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            backgroundColor: colors.light_gray,
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10
          }}
        >
          <Text style={commonStyles.paragraph}>5</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.light_gray,
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10
          }}
        >
          <Text style={commonStyles.paragraph}>10</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.light_gray,
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10
          }}
        >
          <Text style={commonStyles.paragraph}>20</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "auto",
          gap: 10
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.white,
                borderColor: colors.dark_blue,
                borderRadius: 5,
                borderWidth: 1,
                paddingVertical: 5,
                justifyContent: "center",
                alignItems: "center"
              }
            ]}
            onPress={() => {}}
          >
            <Text
              style={[commonStyles.paragraphBold, { color: colors.dark_blue }]}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.white,
                borderColor: colors.red,
                borderRadius: 5,
                borderWidth: 1,
                paddingVertical: 5,
                justifyContent: "center",
                alignItems: "center"
              }
            ]}
            onPress={() => {}}
          >
            <Text style={[commonStyles.paragraphBold, { color: colors.red }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BoxLabel;
