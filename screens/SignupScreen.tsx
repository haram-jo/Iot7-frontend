import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_URL } from "@env";
import { RootStackParamList } from "../navigation/MainStack";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredFood, setPreferredFood] = useState("");
  const [allergicFood, setAllergicFood] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const signup = async () => {
    try {
      // Firebase에서 이메일 & 비밀번호로 인증(회원가입)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // DB에 사용자 정보 저장
      await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          name,
          email,
          password,
          preferredFood,
          allergicFood,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text(); // 에러 메시지 읽기
            throw new Error(errorText);
          }
          return response.json();
        })
        .then((data) => {
          Alert.alert("회원가입 완료! 환영합니다!");
          navigation.navigate("BottomNav");
        })
        .catch((error) => {
          Alert.alert("회원가입 실패", error.message);
        });
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>customer</Text>

      <View style={styles.signupBox}>
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#7a7a7a"
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#7a7a7a"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#7a7a7a"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="선호하는 음식"
          placeholderTextColor="#7a7a7a"
          onChangeText={setPreferredFood}
        />
        <TextInput
          style={styles.input}
          placeholder="못 먹는 음식 (알레르기)"
          placeholderTextColor="#7a7a7a"
          onChangeText={setAllergicFood}
        />
        <TouchableOpacity style={styles.signupButton} onPress={signup}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f0fc",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6a3cbc",
  },
  subtitle: {
    fontSize: 18,
    color: "#6a3cbc",
    marginBottom: 20,
  },
  signupBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#6a3cbc",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  signupButton: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#6a3cbc",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SignupScreen;
