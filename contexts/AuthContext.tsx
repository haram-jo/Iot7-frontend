import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//✅로그인/로그아웃 정보를 앱전체에서 공유할수있도록 해주는 파일

export const AuthContext = createContext<any>(null);
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null); //user가 null이면 로그아웃상태
  const [loading, setLoading] = useState(true);

  //✅ 자동로그인 - 앱 시작 시 저장된 사용자 정보 불러옴
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('유저 로딩 오류:', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ✅로그인 시 Context와 Storage에 저장
  const login = async (userData: any) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃 처리
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{user, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};
