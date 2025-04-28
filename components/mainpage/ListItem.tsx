import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalStyles from '../../styles/GlobalStyles';
import TextTicker from 'react-native-text-ticker';

/* 메인 화면에서 제품 카드 하나하나를 보여주는 컴포넌트 파일 */

const {width, height} = Dimensions.get('window');

//✅ List는 menu props를 받음
interface ListItemProps {
  menu: {
    rating: number;
    description: any;
    menuId: number;
    menuName: string;
    price: number;
    imageUrl?: string; // ✅ 이미지 URL 포함()
  } | null; // 메뉴가 없을 경우 null 허용
}

// ✅ ListItem 컴포넌트 정의 - 각 메뉴 카드 컴포넌트
const ListItem: React.FC<ListItemProps> = ({menu}) => {
  // ✅ navigation 객체 생성
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  const [isLiked, setIsLiked] = React.useState(false);
  //  좋아요 요청 보내는 API로 확장 시
  // const toggleLike = async () => {
  //   const next = !isLiked;
  //   setIsLiked(next);
  //   try {
  //     await axios.post(`${API_URL}/menu/${menu.menuId}/like`, {
  //       liked: next,
  //     });
  //   } catch (err) {
  //     console.error('좋아요 토글 실패', err);
  //     setIsLiked(!next); // 실패 시 롤백
  //   }
  // };

  return (
    <View style={GlobalStyles.card}>
      {/* ✅ 메뉴 이미지 - 클릭 시 상세페이지로 이동 */}
      <TouchableOpacity
        onPress={() =>
          menu && navigation.navigate('Product', {menuId: menu.menuId})
        }>
        <View style={GlobalStyles.imageBox}>
          <Image
            source={{
              uri: menu?.imageUrl || 'https://via.placeholder.com/100', // ✅ 이미지 연동위해 추가
            }}
            style={GlobalStyles.image}
          />
        </View>
      </TouchableOpacity>

      {/* ✅ 메뉴 정보 영역 (텍스트 부분) - 클릭 시 상세페이지로 이동 */}
      <TouchableOpacity
        onPress={() =>
          menu && navigation.navigate('Product', {menuId: menu.menuId})
        }>
        <View style={GlobalStyles.infoBox}>
          {/* ✅ 상단: 메뉴 이름 + 별점 + 찜 아이콘 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '87%',
            }}>
            {/* 왼쪽: 메뉴 이름 */}
            <TextTicker
              style={[GlobalStyles.name, {maxWidth: width * 0.5}]}
              // numberOfLines={1}
              // ellipsizeMode="tail"
              duration={5000} // 텍스트가 이동하는 속도
              loop // 무한 반복
              // bounce // 끝에 닿으면 되돌아감
              repeatSpacer={50} // 반복 시 여백
              marqueeDelay={1000} // 시작 전에 1초 대기
            >
              {menu ? `${menu.menuName}` : '메뉴없음'}{' '}
            </TextTicker>
            {/* 오른쪽: 별점 + 하트 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexShrink: 0, // 오른쪽 아이콘 줄어들지 않게
                marginLeft: 10,
              }}>
              {[...Array(5)].map((_, rating = 3) => (
                <Icon
                  key={rating}
                  name={rating < (menu?.rating ?? 0) ? 'star' : 'star-o'}
                  size={width * 0.038}
                  color="gold"
                  style={{marginLeft: 0}}
                />
              ))}
              <TouchableOpacity onPress={() => setIsLiked(prev => !prev)}>
                <Icon
                  name={isLiked ? 'heart' : 'heart-o'}
                  size={width * 0.05}
                  color={isLiked ? 'red' : '#777'}
                  style={{marginLeft: width * 0.015}}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* ✅ 가격 표시 */}
          <Text style={GlobalStyles.price}>
            {menu ? `${menu.price}원` : '가격정보 없음'}{' '}
          </Text>
          {/* ✅ 메뉴 설명 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[GlobalStyles.text, {maxWidth: width * 0.63}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {menu ? `${menu.description}` : '설명 없음'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;
