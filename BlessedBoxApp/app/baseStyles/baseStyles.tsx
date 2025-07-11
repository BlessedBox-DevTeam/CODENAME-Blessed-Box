import { StyleSheet } from "react-native";
import colors from "./colors";
const commonStyles = StyleSheet.create({
  card: {
    width: "auto",
    height: "auto",
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 24,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4
  },
  title: {
    color: colors.dark_green,
    fontFamily: "PlayfairDisplay-Black",
    fontSize: 36,
    fontStyle: "normal",
    fontWeight: 900
    // lineHeight: 16 * 1.4
  },
  header: {
    color: colors.dark_blue,
    fontFamily: "OpenSans-Bold",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 700
    // lineHeight: 16 * 1.4
  },
  paragraph: {
    color: colors.dark_gray,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 600
    // lineHeight: 16 * 1.4
  },
  paragraphBold: {
    color: colors.dark_gray,
    fontFamily: "OpenSans-Bold",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 700
    // lineHeight: 16 * 1.4
  },
  paragraphExtraBold: {
    color: colors.dark_green,
    fontFamily: "OpenSans-ExtraBold",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 700
    // lineHeight: 16 * 1.4
  },
  container: {
    width: "auto",
    height: "auto",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  // TODO:FIND A BETTER WAY OR ELIMINATE
  gridContainer: {
    flexDirection: "row",
    columnGap: 16,
    marginTop: 20,
    alignItems: "center"
  },
  leftColumn: {
    flex: 1,
    justifyContent: "flex-start",
    rowGap: 16
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.dark_green,
    justifyContent: "center",
    alignItems: "center",
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4
  },
  buttonNoShadow: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.dark_green,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light_gray,
    color: colors.dark_gray,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 700
    // lineHeight: 16 * 1.4
  }
});

export default commonStyles;
