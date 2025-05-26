import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/MainStack';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/mainpage/SearchBar';
import FilterModal from '../components/FilterModal';
import BrandFilterModal from '../components/BrandFilterModal';
import {Image} from 'react-native';
import {API_URL} from '@env';

const {width} = Dimensions.get('window');

// ✅ 제품선택시 상세페이지로 넘어가는 함수
const SearchResultScreen = () => {
  type SearchResultRouteProp = RouteProp<RootStackParamList, 'SearchResult'>;
  // ✅ 타입 명시
  const route = useRoute<SearchResultRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const initialResults = route.params.results; //🔹이전 화면(HomeScreen)에서 받은 검색 결과
  const [results, setResults] = useState(initialResults);
  const [modalVisible, setModalVisible] = useState(false); //🔹필터 모달 창 여닫기
  const [brandModalVisible, setBrandModalVisible] = useState(false); //🔹브랜드 모달 상태 추가
  const [allSearchResults, setAllSearchResults] = useState(initialResults); //🔹전체 검색 결과 저장
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState(''); //🔹현재 검색어 상태
  const [isSearchFocused, setIsSearchFocused] = useState(false); // 🔍 검색창 포커스 여부
  const [hotKeywords, setHotKeywords] = useState<string[]>([]); // 🔥 급상승 키워드 목록

  // ✅ 검색 실행 함수
  const handleSearch = async (keyword: string) => {
    try {
      setSearchKeyword(keyword); // 현재 검색어 상태 저장
      setSelectedBrand(null); // 검색 시 기존 브랜드 선택 해제
      setModalVisible(false);
      setBrandModalVisible(false);

      const response = await fetch(
        `${API_URL}/menu/search?keyword=${encodeURIComponent(keyword)}`,
      );
      let data = await response.json();
      setAllSearchResults(data); // 🔹 전체 검색 결과 저장
      setResults(data); // 🔹 검색 결과 반영
    } catch (error) {
      console.error('검색 중 오류:', error);
    }
  };

  // ✅ 필터 조건에 따라 결과 목록 정렬하는 함수
  const handleApplyFilter = async (filters: any) => {
    console.log('🧪 필터 적용 시작:', filters); // ✅ 필터 값 찍기

    let filtered = [...allSearchResults]; // 🔥 항상 최신 전체 결과 기준으로 필터링

    // ✅ 1. 재료 키워드 필터링 (ex: '우유' 포함된 메뉴만 보기)
    if (filters.ingredientKeyword) {
      console.log('🔥 포함 필터링 진입함');
      filtered = filtered.filter(item => {
        console.log('🧪 전체 아이템 구조 확인:', item);
        return (item.description || '')
          .toLowerCase()
          .includes(filters.ingredientKeyword.toLowerCase());
      });
    }
    // ✅ 2. 재료 제외 키워드 필터링 (ex: '우유' 제외한 메뉴만 보기)
    if (filters.excludeKeyword) {
      console.log('🔥 제외 필터링 진입함');
      filtered = filtered.filter(item => {
        return !(item.description || '')
          .toLowerCase()
          .includes(filters.excludeKeyword.toLowerCase());
      });
    }

    // 브랜드 필터링도 함께 적용 (브랜드 선택된 경우)
    if (selectedBrand) {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }

    // ✅ 3. 정렬 필터링 ( ex: 인기순, 신상순, 다이어트 순)
    console.log('✅ 선택된 정렬 옵션:', filters.selectedSort);
    switch (filters.selectedSort) {
      case '가격 낮은 순':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case '가격 높은 순':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case '인기순':
        filtered.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
        break;
      case '다이어트 순':
        filtered.sort((a, b) => (a.calorie || 0) - (b.calorie || 0));
        break;
      case '신상순':
        filtered.sort(
          (a, b) =>
            new Date(b.regDate).getTime() - new Date(a.regDate).getTime(),
        );
    }

    setResults(filtered);
  };

  // ✅ 4. 브랜드 선택 시 메뉴 필터링 ( ex: 메가커피, 빽다방, CU)
  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName); // 🔹 선택한 브랜드 저장
    setBrandModalVisible(false); // 🔹 모달 닫기

    const filtered = allSearchResults.filter(item => item.brand === brandName);
    setResults(filtered);
  };

  //🔥  5. 급상승 키워드 백엔드 호출
  const fetchHotKeywords = async () => {
    try {
      const response = await fetch(`${API_URL}/click/hot-keywords`);
      const data = await response.json();
      setHotKeywords(data.map((item: any) => item.menuName));
    } catch (error) {
      console.error('🔥 급상승 키워드 로딩 실패:', error);
    }
  };

  // 🔥 6. 급상승 키워드 클릭시 상세페이지 이동 함수
  const handleKeywordPress = async (keyword: string) => {
    setIsSearchFocused(false); // 오버레이 닫기

    try {
      const response = await fetch(
        `${API_URL}/menu/search?keyword=${encodeURIComponent(keyword)}`,
      );
      const data = await response.json();

      const exactMatch = data.find((item: any) => item.menuName === keyword);

      if (exactMatch) {
        //@ts-ignore
        navigation.navigate('Product', {menuId: exactMatch.menuId});
      } else {
        console.warn('정확히 일치하는 메뉴가 없습니다.');
      }
    } catch (error) {
      console.error('검색 중 오류:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* ✅ 1. 고정된 검색창 */}
      <View style={{paddingTop: 45}}>
        <SearchBar
          showBackButton={true} // ✅ 뒤로가기 버튼 표시
          onSearch={handleSearch}
          onFocus={() => {
            setIsSearchFocused(true);
            fetchHotKeywords();
          }}
          onBlur={() => {
            setIsSearchFocused(false);
            Keyboard.dismiss();
          }}
        />
      </View>

      {/* ✅ 2. 급상승 키워드 UI  */}
      {/* 검색창에 포커스될 때(true일때)만 아래 UI가 보여짐 */}
      {isSearchFocused && (
        <TouchableWithoutFeedback
          onPress={() => {
            setIsSearchFocused(false);
            Keyboard.dismiss();
          }}>
          <View
            style={{
              position: 'absolute',
              top: 97, // 🔥 검색창 높이 + padding 만큼 내려서 아래만 덮기(잊어버리지마)
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              zIndex: 999,
              elevation: 5,
              paddingHorizontal: 20,
              paddingTop: 16,
            }}>
            <KeyboardAvoidingView>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>
                🔥 급상승 검색어
              </Text>
              {hotKeywords.map((keyword, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleKeywordPress(keyword)}>
                    <Text style={{fontSize: 15, paddingVertical: 6}}>
                      {index + 1}. {keyword}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* ✅ 3. 필터 버튼 + 검색 결과 영역 (스크롤 가능) */}
      <ScrollView style={{flex: 1}}>
        {/* 필터 버튼 영역 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 10,
          }}>
          {/* 브랜드 필터 */}
          <TouchableOpacity
            onPress={() => setBrandModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
            <Icon name="storefront-outline" size={20} color="#333" />
            <Text style={{fontSize: 14, marginLeft: 4}}>브랜드</Text>
          </TouchableOpacity>

          {/* 일반 필터 */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Icon name="filter" size={20} color="#333" />
            <Text style={{fontSize: 14}}>필터</Text>
          </TouchableOpacity>
        </View>

        {/* 결과 리스트 영역 */}
        <View style={{padding: 16}}>
          {results.length > 0 ? (
            results.map((menu, idx) => (
              <TouchableOpacity
                key={menu.menuId || idx}
                onPress={async () => {
                  await fetch(`${API_URL}/click/log?menuId=${menu.menuId}`, {
                    method: 'POST',
                  });
                  navigation.navigate('Product', {menuId: menu.menuId});
                }}
                style={{
                  marginBottom: 15,
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  shadowColor: '#ccc',
                  shadowOpacity: 0.3,
                  shadowOffset: {width: 0, height: 1},
                }}>
                {menu.imageUrl ? (
                  <Image
                    source={{uri: menu.imageUrl}}
                    style={{width: 70, height: 70, borderRadius: 6}}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      backgroundColor: '#e0e0e0',
                      borderRadius: 6,
                    }}
                  />
                )}
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {menu.menuName}
                  </Text>
                  <Text style={{color: '#333', marginTop: 4}}>
                    {menu.price.toLocaleString()}원
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              검색 결과가 없습니다.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* ✅ 모달들 */}
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilter}
      />
      <BrandFilterModal
        visible={brandModalVisible}
        onClose={() => setBrandModalVisible(false)}
        onSelectBrand={handleBrandSelect}
      />
    </View>
  );
};
export default SearchResultScreen;
