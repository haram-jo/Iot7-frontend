import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {API_URL} from '@env';

const {width, height} = Dimensions.get('window');

const SearchBar = ({onSearch, onFocus, onBlur, showBackButton = false}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  const handleSearch = () => {
    if (onSearch && input.trim() !== '') {
      onSearch(input);
      Keyboard.dismiss();
      onBlur?.();
    }
  };

  return (
    <View style={{marginTop: width * 0.13, position: 'relative'}}>
      {/* 로고 (검색창 왼쪽 위에 겹치게 배치) */}
      <Image
        source={require('../../assets/images/log_1.png')}
        style={{
          position: 'absolute',
          top: -width * 0.125, // 검색창 위로 살짝 올라가게
          left: width * 0.05,
          width: width * 0.2,
          height: width * 0.2,
          resizeMode: 'contain',
          zIndex: 10, // 검색창 위로 올라오게
        }}
      />

      {/* 검색창 전체 래퍼 */}
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
          marginBottom: 10,
        }}>
        {/* 왼쪽: 메뉴 또는 뒤로가기 아이콘 */}
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={width * 0.06} color="#333" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => console.log('메뉴 눌림')}>
            <Icon name="menu" size={width * 0.06} color="#333" />
          </TouchableOpacity>
        )}

        {/* 중간: 입력창 */}
        <TextInput
          ref={inputRef}
          placeholder="메뉴를 검색하세요"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSearch}
          onFocus={() => {
            onFocus?.();
          }}
          style={{
            flex: 1,
            marginLeft: width * 0.03,
            fontSize: width * 0.04,
            paddingVertical: 0,
          }}
        />

        {/* 오른쪽: 검색 아이콘 */}
        <TouchableOpacity
          onPress={() => {
            inputRef.current?.focus();
            handleSearch();
          }}>
          <Icon name="search" size={width * 0.06} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
