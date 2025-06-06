import { Text, TouchableOpacity, View } from "react-native";
import { commonStyles } from "./baseStyles/baseStyles";
import { colors } from "./baseStyles/colors";
import { CircularProgress } from "./components/circularProgress";

export default function Index() {
  return (
    <View>

    <View style={[commonStyles.card, commonStyles.gridContainer]} >
      <View style={commonStyles.leftColumn}>
            <Text style={commonStyles.title}>OCC<Text style={{color:colors.red_label}}>2025</Text> </Text>
            <Text style={commonStyles.header}>Yearly Goal</Text>
            <Text style={commonStyles.paragraphBold}>Boxes Collected: <Text style={{color:colors.green}}>6,000</Text> </Text>
            <Text style={commonStyles.paragraph}>Reaching Point: 12,000 Boxes</Text>
      </View>
          <View style={commonStyles.rightColumn}><CircularProgress percentage={50}/></View>
    </View>

    <View style={[commonStyles.card, {marginTop: 20, rowGap:16}]} > 
            <Text style={commonStyles.paragraph}>Your Contribution</Text>
            <Text style={commonStyles.paragraph}>You have deposited a total of<Text style={{color:colors.green}}> 45 </Text>boxes</Text>
            <Text style={commonStyles.paragraph}>Great job! Keep it going!</Text>
            <TouchableOpacity style={commonStyles.button} onPress={() => alert('Add more boxes!')}>
              <Text style={[commonStyles.header, {color:colors.white}]}>View Activity</Text> </TouchableOpacity>
    </View>

    </View>

  );
}
