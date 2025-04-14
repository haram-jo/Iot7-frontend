import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalStyles from '../../styles/GlobalStyles';

/* 메인 화면에서 제품 카드 하나하나를 보여주는 컴포넌트 파일 */

const {width, height} = Dimensions.get('window');

//✅ List는 menu props를 받음
interface ListItemProps {
  menu: {
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
            }}>
            {/* ✅ 메뉴 이름 표시 */}
            <Text style={GlobalStyles.name}>
              {menu ? `${menu.menuName}` : '메뉴없음'}{' '}
            </Text>
            {/* ✅ 별점 아이콘 (현재는 고정된 별 5개) */}
            <View style={GlobalStyles.rating}>
              {[...Array(5)].map((_, rating = 3) => (
                <Icon
                  key={rating}
                  name="star"
                  size={width * 0.04}
                  color="gold"
                />
              ))}
            </View>
            {/* ✅ 좋아요(찜) 아이콘 - 현재는 동작 없음 */}
            <TouchableOpacity>
              <Icon
                name="heart-o"
                size={width * 0.06}
                color="#777"
                style={{marginLeft: width * 0.02}}
              />
            </TouchableOpacity>
          </View>
          {/* ✅ 가격 표시 */}
          <Text style={GlobalStyles.price}>
            {menu ? `${menu.price}원` : '가격정보 없음'}{' '}
          </Text>
          {/* ✅ 하단 보조 텍스트 (현재는 고정 텍스트) */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={GlobalStyles.text}>
              Supporting line text lorem ipsum...
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;
