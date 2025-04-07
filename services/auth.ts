// auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from '../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

// 인증 관련 함수들만 모아둔 곳, 전부 Firebase 인증 + 서버 연동 관련기능

// 🔹 회원가입 (Firebase 계정 생성 + 추가정보 서버 전송)
export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string,
  preferredFood: string,
  allergicFood: string,
) => {
  try {
    const {user} = await createUserWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();

    const {data} = await axios.post(`${API_URL}/register`, {
      token,
      name,
      email,
      preferredFood,
      allergicFood,
    });

    // 회원가입 후 자동 로그인 처리 (토큰 저장)
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(data));

    return {success: true, user: data};
  } catch (error: any) {
    console.error('회원가입 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// 🔹 로그인 (Firebase 인증, 서버에 토큰 전달, 사용자 정보 조회)
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const {user} = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();

    const {data} = await axios.post(`${API_URL}/login`, {token});

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(data));

    return {success: true, user: data};
  } catch (error: any) {
    console.error('로그인 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// 🔹 로그아웃 (저장된 데이터 제거)
export const signOut = async () => {
  try {
    await AsyncStorage.clear();
    return {success: true};
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return {success: false};
  }
};

// 🔹 저장된 사용자 데이터 불러오기
export const getStoredUserData = async () => {
  const data = await AsyncStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};
