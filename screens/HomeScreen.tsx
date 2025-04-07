import React, {useState, useLayoutEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'; // ✅ 필요한 컴포넌트 추가
import SearchBar from '../components/mainpage/SearchBar';
import Banner from '../components/mainpage/Banner';
import CategoryTabs from '../components/mainpage/CategoryTabs';
import GlobalStyles from '../styles/GlobalStyles';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>('defaultCategory');
  const navigation = useNavigation(); // ✅ 페이지 이동용 navigation

  // ✅ 검색창에서 키워드 검색 시 실행되는 함수
  const handleSearch = async (keyword: string) => {
    try {
      const response = await fetch(
        `${API_URL}/menu/search?keyword=${encodeURIComponent(keyword)}`,
      );
      const data = await response.json();
      console.log('받아온 메뉴 데이터:', data);
      //@ts-ignore
      navigation.navigate('SearchResult', {results: data}); // ✅ 검색결과 페이지로 이동
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  return (
    <ScrollView style={GlobalStyles.container}>
      {/* ✅ 로그인 버튼 - 검색창 위 오른쪽 정렬 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          marginTop: 16,
        }}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ 검색 기능 연결 */}
      <SearchBar onSearch={handleSearch} />

      <Banner />
      <CategoryTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </ScrollView>
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
