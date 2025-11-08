import axios from "axios";
import { Stack, useRouter } from "expo-router"; // likely named export
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client";
import commonStyles from "./baseStyles/baseStyles"; // default export
import colors from "./baseStyles/colors"; // default export
import LoadingOverlay from "./components/LoadingSpinner";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    return router.replace("./home");
    setIsLoading(true);
    try {
      const port = process.env.PORT;
      const url = process.env.URL;
      const response = await axios.post(`${url}:${port}/api/auth/login`, {
        email: email,
        password: password
      });

      const user = true;
      console.log(user);

      if (!user) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setTimeout(() => {
          setModalVisible(true);
        }, 1000);
      } else {
        // 2. Guardar usuario si quieres (opcional)
        // localStorage.setItem("user", JSON.stringify(user));

        // // 3. Conectarse al socket con datos del usuario
        // const socket = io("http://localhost:4000", {
        //   auth: {
        //     userId: user.userId,
        //     email: user.email
        //   }
        // });

        // // 4. Escuchar eventos del socket
        // socket.on("connect", () => {
        //   console.log(`Conectado como ${user.email}`);
        // });

        // socket.on("chatMessage", (msg) => {
        //   console.log("Mensaje recibido:", msg);
        // });
        router.replace("./home");
      }
    } catch (error) {
      console.error("Error de login:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flexDirection: "column",
          gap: 16,
          padding: 20,
          alignItems: "center",
          height: "100%",
          justifyContent: "space-between"
        }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingOverlay visible={isLoading} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
                width: "80%",
                height: "100%"
              }}
            >
              <Text style={commonStyles.paragraph}>
                Your email or password is incorrect
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={[commonStyles.title, { paddingTop: 15 }]}>
          Blessed Box
        </Text>
        <View style={{ flexDirection: "column", gap: 16, width: "100%" }}>
          <TextInput
            style={commonStyles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={commonStyles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>
        <TouchableOpacity style={[commonStyles.button]} onPress={handleLogin}>
          <Text style={[commonStyles.header, { color: colors.white }]}>
            Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
