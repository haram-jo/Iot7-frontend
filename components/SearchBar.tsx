import React, {useState} from 'react';
import {View, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

// ✅ props로 onSearch 받기(홈화면 검색할때 필요한 것들)
const SearchBar = ({onSearch}) => {
  const [input, setInput] = useState('');

  // ✅ 홈화면에서 검색창에 검색했을때 실행되는는 함수
  const handleSearch = () => {
    if (onSearch && input.trim() !== '') {
      onSearch(input); // 상위(HomeScreen)의 handleSearch 실행
    }
  };

  return (
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
      }}>
      <Icon name="menu" size={width * 0.06} color="#333" />

      {/* ✅ 입력 상태 반영 */}
      <TextInput
        placeholder="메뉴를 검색하세요"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSearch} // 엔터 키로 검색
        style={{
          flex: 1,
          marginLeft: width * 0.02,
          paddingVertical: width * 0.02,
          fontSize: width * 0.04,
        }}
      />

      {/* ✅ 검색 버튼 눌렀을 때 검색 */}
      <TouchableOpacity onPress={handleSearch}>
        <Icon name="search" size={width * 0.06} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
