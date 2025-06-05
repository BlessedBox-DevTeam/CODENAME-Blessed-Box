import { Text, View } from "react-native";
import { commonStyles } from "./baseStyles/baseStyles";
import { colors } from "./baseStyles/colors";
import { CircularProgress } from "./components/circularProgress";

export default function Index() {
  return (
    <View style={[commonStyles.card, commonStyles.gridContainer]} >

 <View style={commonStyles.leftColumn}>
      <Text style={commonStyles.title}>OCC <Text style={{color:colors.red_label}}>2025</Text> </Text>
      <Text style={commonStyles.header}>Yearly Goal</Text>
      <Text style={commonStyles.paragraph}>Boxes Collected: <Text style={{color:colors.green}}> 6,000</Text> </Text>
      <Text style={commonStyles.paragraph}>Reaching Point: 12,000 Boxes </Text>
 </View>
    <View style={commonStyles.rightColumn}><CircularProgress percentage={50} /></View>

  </View>
  );
}
