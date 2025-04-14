import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ✅ 전달된 값들에 접근하기 위한 타입 정의
type BrandRouteProp = RouteProp<RootStackParamList, 'BrandMenuList'>;

// ✅ 네비게이션 타입 선언
type Navigation = NativeStackNavigationProp<RootStackParamList>;

// ✅ 화면 생성
const BrandMenuListScreen = () => {
  const route = useRoute<BrandRouteProp>(); // ✅ 현재 화면 정보
  const navigation = useNavigation<Navigation>(); // ✅ navigation 타입 지정
  const {brandName} = route.params; // ✅ 브랜드 이름 받아오기

  const [menus, setMenus] = useState<any[]>([]);

  // ✅ 컴포넌트 처음 실행시 브랜드 메뉴 받아오기
  useEffect(() => {
    if (brandName) {
      const fetchMenus = async () => {
        try {
          const response = await fetch(
            `${API_URL}/menu/brand?brandName=${encodeURIComponent(brandName)}`,
          );
          const data = await response.json();
          setMenus(data); // ✅ 받아온 메뉴 저장
        } catch (error) {
          console.error('브랜드 메뉴 조회 오류:', error);
        }
      };
      fetchMenus(); // ✅ 함수 실행
    }
  }, [brandName]); // ✅ 브랜드 이름이 바뀔 때마다 실행

  // ✅ 메뉴 하나 하나의 UI 정의
  const renderItem = ({item}: {item: any}) => {
    console.log('🔥 imageUrl:', item.imageUrl);
    const imageUrl = item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `${API_URL}/${item.imageUrl || ''}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Product', {menuId: item.menuId})}>
        <Image source={{uri: imageUrl}} style={styles.image} />
        <Text style={styles.name}>{item.menuName}</Text>
        <Text style={styles.price}>{item.price}원</Text>
      </TouchableOpacity>
    );
  };

  // ✅ 전체화면 UI
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* ✅ 상단 헤더: 뒤로가기 + 브랜드 이름 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{brandName} 메뉴</Text>
      </View>

      {/* ✅ 메뉴가 없을 때 */}
      {menus.length === 0 ? (
        <Text style={styles.emptyText}>메뉴가 없습니다</Text>
      ) : (
        // ✅ 메뉴가 있을 때 2열로 FlatList로 렌더링
        <FlatList
          data={menus}
          keyExtractor={item => item.menuId.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 6,
    marginBottom: 11,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    fontSize: 13,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#aaa',
  },
});

export default BrandMenuListScreen;
