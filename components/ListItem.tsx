import {useNavigation} from '@react-navigation/native';
import React, {NamedExoticComponent} from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type {RootStackParamList} from '../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalStyles from '../styles/GlobalStyles';

const {width, height} = Dimensions.get('window');

interface ListItemProps {
  menu: {
    menuId: number;
    menuName: string;
    price: number;
  } | null; // 메뉴가 없을 경우 null 허용
}

const ListItem: React.FC<ListItemProps> = ({menu}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  return (
    <View style={GlobalStyles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Product', {menu})}>
        <View style={GlobalStyles.imageBox}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={GlobalStyles.image}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Product', {menu})}>
        <View style={GlobalStyles.infoBox}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={GlobalStyles.name}>
              {menu ? `${menu.menuName}` : '메뉴없음'}{' '}
            </Text>
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
            <TouchableOpacity>
              <Icon
                name="heart-o"
                size={width * 0.06}
                color="#777"
                style={{marginLeft: width * 0.02}}
              />
            </TouchableOpacity>
          </View>
          <Text style={GlobalStyles.price}>
            {menu ? `${menu.price}원` : '가격정보 없음'}{' '}
          </Text>
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
