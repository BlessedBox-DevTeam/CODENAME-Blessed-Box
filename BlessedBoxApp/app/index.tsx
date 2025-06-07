import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { commonStyles } from "./baseStyles/baseStyles";
import { colors } from "./baseStyles/colors";
import { CircularProgress } from "./components/circularProgress";
import { useState } from "react";
import axios from 'axios';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
      // const response = await axios.post('http://192.168.11.189:3000/api/auth/login', {
        email: email,
        password: password,
      });

      Alert.alert('Éxito', response.data.message);
      console.log('Usuario:', response.data.user);
    } catch (error) {
      console.error(error);
      Alert.alert( error + 'Fallo al iniciar sesión');
    }
  };

  return (
    <View>

    {/* <View style={[commonStyles.card, commonStyles.gridContainer]} >
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
    </View> */}

    <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
        <Text style={[commonStyles.header, { color: colors.white }]}>Iniciar sesión</Text>
      </TouchableOpacity>

    </View>

  );
}
