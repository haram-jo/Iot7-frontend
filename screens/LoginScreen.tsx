import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {signInWithEmail} from '../services/auth';
import {RootStackParamList} from '../navigation/MainStack';
import {useContext} from 'react'; //
import {AuthContext} from '../contexts/AuthContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

//✅ 컴포넌트 시작
const LoginScreen = () => {
  const [email, setEmail] = useState(''); // 이메일 입력값 상태저장
  const [password, setPassword] = useState(''); // 비번 입력값 상태저장
  const [isLoading, setIsLoading] = useState(false); // 로그인시 보여줄 로딩 상태 추가

  const navigation = useNavigation<LoginScreenNavigationProp>(); // 페이지 이동기능 초기화
  const {login} = useContext(AuthContext); // 로그인시 Authtext에서 로그인 함수 가져옴

  const handleLogin = async () => {
    console.log('🔐 로그인 버튼 눌림');
    setIsLoading(true);

    try {
      const result = await signInWithEmail(email, password); // ✅ auth.ts 함수 사용

      if (!result.success) {
        throw new Error(result.error);
      }

      await login(result.user); // ✅ Context에 로그인 정보 저장
      navigation.navigate('BottomNav');
    } catch (error: any) {
      console.error('로그인 실패:', error);
      Alert.alert(
        '로그인 실패',
        error.message || '이메일 또는 비밀번호를 확인해주세요.',
      );
    } finally {
      setIsLoading(false);
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
            {/* ✅ 로딩 중이면 버튼 대신 ActivityIndicator 표시 */}
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>로그인</Text>
            )}
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
