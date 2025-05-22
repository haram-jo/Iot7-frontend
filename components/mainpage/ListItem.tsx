import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalStyles from '../../styles/GlobalStyles';
import TextTicker from 'react-native-text-ticker';
import {useEffect} from 'react';
import {API_URL} from '@env';

const {width} = Dimensions.get('window');

interface ListItemProps {
  menu: {
    rating: number;
    description: any;
    menuId: number;
    menuName: string;
    price: number;
    imageUrl?: string;
  } | null;
}

const ListItem: React.FC<ListItemProps> = ({menu}) => {
  useEffect(() => {
    if (menu) {
      console.log(`menuId: ${menu.menuId}, 평균 별점: ${menu.rating}`);
    }
  }, [menu]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  const [isLiked, setIsLiked] = React.useState(false);

  // ✅ 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon
          key={`full-${i}`}
          name="star"
          size={width * 0.038}
          color="gold"
        />,
      );
    }

    if (halfStar) {
      stars.push(
        <Icon
          key="half"
          name="star-half-o"
          size={width * 0.038}
          color="gold"
        />,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-o"
          size={width * 0.038}
          color="gold"
        />,
      );
    }

    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };

  return (
    <View style={GlobalStyles.card}>
      <TouchableOpacity
        onPress={async () => {
          if (!menu) return;

          // ✅ 클릭 로그를 백엔드에 전송 ✅

          try {
            const response = await fetch(
              `${API_URL}/click/log?menuId=${menu.menuId}`,
              {
                method: 'POST',
              },
            );
            const result = await response.text();
            console.log('🔥 이미지 클릭 로그 응답:', result);
          } catch (error) {
            console.error('❌ 이미지 클릭 로그 실패:', error);
          }

          navigation.navigate('Product', {menuId: menu.menuId});
        }}>
        <View style={GlobalStyles.imageBox}>
          <Image
            source={{
              uri: menu?.imageUrl || 'https://via.placeholder.com/100',
            }}
            style={GlobalStyles.image}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (!menu) return;

          try {
            // ✅ 클릭 로그를 백엔드에 전송 ✅
            const response = await fetch(
              `${API_URL}/click/log?menuId=${menu.menuId}`,
              {
                method: 'POST',
              },
            );
            const result = await response.text();
            console.log('🔥 정보 클릭 로그 응답:', result);
          } catch (error) {
            console.error('❌ 정보 클릭 로그 실패:', error);
          }

          navigation.navigate('Product', {menuId: menu.menuId});
        }}>
        <View style={GlobalStyles.infoBox}>
          {/* ✅ 메뉴명 + 별점 + 찜 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '86%',
            }}>
            {/* 메뉴명 */}
            <TextTicker
              style={[GlobalStyles.name, {maxWidth: width * 0.39}]} //메뉴 프레임
              duration={5000}
              loop
              repeatSpacer={50}
              marqueeDelay={1000}>
              {menu ? `${menu.menuName}` : '메뉴없음'}{' '}
            </TextTicker>

            {/* 별점*/}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexShrink: 0,
                marginLeft: 10,
              }}>
              {renderStars(menu?.rating ?? 0)}
            </View>
          </View>

          {/* ✅ 가격 */}
          <Text style={GlobalStyles.price}>
            {menu ? `${menu.price}원` : '가격정보 없음'}{' '}
          </Text>

          {/* ✅ 설명 */}
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
