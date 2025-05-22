import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// 1. 사용자의 검색어 입력만 처리
// 2. 검색 버튼 또는 키보드 제출 시 `onSearch`를 호출해서 검색어 전달
// 3. 포커스될 때 `onFocus`를 호출하여 부모(HomeScreen)가 급상승 키워드 UI를 띄울 수 있도록
// 4. SearchBar는 onFocus, onSearch만 담당
// 5. 급상승 키워드 UI 자체는 HomeScreen이 담당

const {width, height} = Dimensions.get('window');

const SearchBar = ({onSearch, onFocus, onBlur, showBackButton = false}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  //✅현재 입력된 검색어로 검색 실행
  const handleSearch = () => {
    if (onSearch && input.trim() !== '') {
      onSearch(input);
      Keyboard.dismiss();
      onBlur?.(); // ✅ 검색 후 오버레이 닫기
    }
  };

  return (
    <>
      {/* 검색창 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: width * 0.9,
          height: height * 0.05,
          alignSelf: 'center',
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingHorizontal: width * 0.03,
          elevation: 2,
          marginVertical: width * 0.03,
          zIndex: 1000,
          position: 'relative',
        }}>
        {/* 메뉴 아이콘 */}
        {/* 조건부로 뒤로가기 또는 메뉴 아이콘 */}
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={width * 0.06} color="#333" />
          </TouchableOpacity>
        ) : (
          <Icon name="menu" size={width * 0.06} color="#333" />
        )}
        {/* 사용자 입력창 */}
        <TextInput
          ref={inputRef}
          placeholder="메뉴를 검색하세요"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSearch}
          onFocus={() => {
            onFocus?.(); // {/*부모(HomeScreen)의 급상승 키워드 표시*}
          }}
          style={{
            flex: 1,
            marginLeft: width * 0.03,
            paddingVertical: width * 0.02,
            fontSize: width * 0.04,
          }}
        />

        {/*검색 아이콘 버튼 */}
        <TouchableOpacity
          onPress={() => {
            inputRef.current?.focus();
            handleSearch();
          }}>
          <Icon name="search" size={width * 0.06} color="#333" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SearchBar;
