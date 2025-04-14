import React, {useState, useRef} from 'react'; // 🔹 useRef 추가
import {
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

// ✅ 부모에게 props를 받아서 onSearch 가져옴
const SearchBar = ({onSearch}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null); // ✅ 자판 ref 생성

  // ✅ 사용자가 검색 실행할 때 호출되는 함수
  const handleSearch = () => {
    if (onSearch && input.trim() !== '') {
      onSearch(input); // 상위(HomeScreen)의 handleSearch 실행
      Keyboard.dismiss(); // ✅ 검색 후 자판 내림
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
      {/* ✅ 좌측에 햄버거 아이콘 */}
      <Icon name="menu" size={width * 0.06} color="#333" />

      {/* ✅ 사용자가 검색어를 입력하는 창 */}
      <TextInput
        ref={inputRef} // ✅ TextInput에 ref 연결
        placeholder="메뉴를 검색하세요"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSearch} // 엔터(확인)를 누르면 검색 실행
        style={{
          flex: 1,
          marginLeft: width * 0.02,
          paddingVertical: width * 0.02,
          fontSize: width * 0.04,
        }}
      />

      {/* ✅ 우측 검색 아이콘 버튼 */}
      <TouchableOpacity
        onPress={() => {
          inputRef.current?.focus(); // ✅ 버튼 누르면 자판 올림 (focus() 호출)
          handleSearch(); // 🔹 검색 실행
        }}>
        <Icon name="search" size={width * 0.06} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
