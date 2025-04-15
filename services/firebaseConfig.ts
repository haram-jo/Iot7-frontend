import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 Firebase 설정값
const firebaseConfig = {
  apiKey: 'AIzaSyCiorzdOWoeLPptWAV7xm56TmdN8lLqL4c',
  authDomain: 'iot7-435d1.firebaseapp.com',
  projectId: 'iot7-435d1',
  storageBucket: 'iot7-435d1.appspot.com',
  messagingSenderId: '981339430588',
  appId: '1:981339430588:web:7b265ed5b76d038c7afab9',
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ✅ React Native 환경에서 Auth + AsyncStorage 연동
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export {app, auth};
