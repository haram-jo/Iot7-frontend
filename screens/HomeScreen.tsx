import React, {useState, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Alert} from 'react-native';
import SearchBar from '../components/mainpage/SearchBar';
import Banner from '../components/mainpage/Banner';
import CategoryTabs from '../components/mainpage/CategoryTabs';
import GlobalStyles from '../styles/GlobalStyles';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>('defaultCategory');
  const navigation = useNavigation(); // ✅ 페이지 이동용 navigation
  const {user, logout} = useContext(AuthContext); // ✅ 로그인 상태와 로그아웃 기능을 AuthContext에서 받아옴

  // ✅ 로그아웃 버튼 눌렀을때 실행되는 함수
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          onPress: () => {
            logout(); // user = null
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  // ✅ 검색창에서 키워드 검색 시 실행되는 함수
  const handleSearch = async (keyword: string) => {
    try {
      const response = await fetch(
        `${API_URL}/menu/search?keyword=${encodeURIComponent(keyword)}`,
      );
      const data = await response.json();
      // console.log('받아온 메뉴 데이터:', data);
      //@ts-ignore
      navigation.navigate('SearchResult', {results: data}); // ✅ 검색결과 페이지로 이동
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  return (
    // <ScrollView style={GlobalStyles.container}>

    <View style={GlobalStyles.container}>
      {/* ✅ 로그인/로그아웃 버튼 - 검색창 위 오른쪽 정렬 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          marginTop: 16,
        }}>
        {user ? ( // ✅ 로그인이 되어 있을 경우
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.loginButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          // ✅ 로그인이 안되어 있을 경우
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ 검색 기능 연결 */}
      <SearchBar onSearch={handleSearch} />

      <Banner />
      <CategoryTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#8000FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
