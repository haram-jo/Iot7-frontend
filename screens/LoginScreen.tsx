import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../services/firebaseConfig'; // 🔧 Firebase 설정
import {API_URL} from '@env';
import {RootStackParamList} from '../navigation/MainStack';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    console.log('🔐 로그인 버튼 눌림');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('서버 응답 실패');
      }

      const data = await response.json();

      Alert.alert('로그인 성공!', `${data.userName}님 환영합니다!`);
      navigation.navigate('BottomNav');
    } catch (error: any) {
      console.error('로그인 실패:', error);
      Alert.alert(
        '로그인 실패',
        error.message || '이메일 또는 비밀번호를 확인해주세요.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>customer</Text>

      <View style={styles.loginBox}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#7a7a7a"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={text => setEmail(text.toLowerCase())}
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#7a7a7a"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f0fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6a3cbc',
  },
  subtitle: {
    fontSize: 18,
    color: '#6a3cbc',
    marginBottom: 20,
  },
  loginBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6a3cbc',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#6a3cbc',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5,
  },
  signupButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6a3cbc',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupText: {
    color: '#6a3cbc',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
