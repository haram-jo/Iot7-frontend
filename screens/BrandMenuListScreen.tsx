import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthContext} from '../contexts/AuthContext';
import {useContext} from 'react';
import Toast from 'react-native-root-toast';

// ✅ 전달된 값들에 접근하기 위한 타입 정의
type BrandRouteProp = RouteProp<RootStackParamList, 'BrandMenuList'>;

// ✅ 네비게이션 타입 선언
type Navigation = NativeStackNavigationProp<RootStackParamList>;

// ✅ 화면 생성
const BrandMenuListScreen = () => {
  const route = useRoute<BrandRouteProp>(); // ✅ 현재 화면 정보
  const navigation = useNavigation<Navigation>(); // ✅ navigation 타입 지정
  const {brandName, businessId} = route.params; // ✅ 브랜드 이름 받아오기
  const [isSubscribed, setIsSubscribed] = useState(false); // ✅ 구독 상태 관리용
  const {user} = useContext(AuthContext);

  const [menus, setMenus] = useState<any[]>([]);

  // ✅ 구독 기능 함수
  const handleSubscribe = async () => {
    console.log('✅ 하트 눌림');

    if (!user) {
      console.log('❗ 로그인 필요');
      navigation.navigate('Login'); // ✅ 로그인 화면으로 이동
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          businessId: businessId,
        }),
      });

      console.log('✅ 서버 응답 상태코드:', response.status);

      if (response.ok) {
        const result = await response.json(); //백엔드에서 받은 boolean(true or false)
        setIsSubscribed(result); // true면 구독 상태, false면 구독 취소 상태

        // ✅ 구독 알림창 띄우기
        Toast.show(
          result ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 제거했어요',
          {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: '#222', //
            textColor: '#fff',
            containerStyle: {
              marginBottom: 20,
              width: '90%', // 또는 고정값: width: 320
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignSelf: 'center', // ⭐ 가운데 정렬
              minWidth: 350,
            },
          },
        );

        console.log(result ? '구독 등록 성공!' : '구독 취소 성공!');
      } else {
        console.log('구독 실패!');
      }
    } catch (error) {
      console.error('구독 에러:', error);
    }
  };

  // ✅ 브랜드 진입시 유저 구독상태 확인하는 함수
  useEffect(() => {
    const checkSubscribe = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `${API_URL}/api/subscribe/check?userId=${user.userId}&businessId=${businessId}`,
        );
        const result = await res.json();
        setIsSubscribed(result); // true면 핑크 하트, false면 회색 하트
      } catch (error) {
        console.error('구독 상태 확인 실패:', error);
      }
    };

    checkSubscribe();
  }, [user, businessId]);

  // ✅ 컴포넌트 처음 실행시 브랜드 메뉴 받아오기
  useEffect(() => {
    console.log('🧾 요청 브랜드명:', brandName);
    console.log('📦 브랜드 메뉴 데이터: ', menus);

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
        <Text style={styles.headerTitle}>{brandName}</Text>
        {/* 🧡 하트 아이콘 오른쪽 끝에 붙이기 */}
        <TouchableOpacity
          onPress={handleSubscribe}
          style={styles.heartButton} // ✅ 하트 스타일
        >
          {isSubscribed ? (
            <Ionicons name="heart" size={28} color="#e74c3c" />
          ) : (
            <Ionicons name="heart-outline" size={28} color="#aaa" />
          )}
        </TouchableOpacity>
      </View>

      {/* ✅ 메뉴가 없을 때 */}
      {menus.length === 0 ? (
        <Text style={styles.emptyText}>메뉴가 없습니다</Text>
      ) : (
        // ✅ 메뉴가 있을 때 2열로 FlatList로 렌더링
        <FlatList
          data={menus}
          keyExtractor={(item, index) =>
            (item?.menuId ?? `item-${index}`).toString()
          }
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
  heartButton: {
    marginLeft: 'auto',
    marginRight: 8, // ⭐ 오른쪽에 여유 8px 정도 줌 (숫자는 조절 가능)
  },
});

export default BrandMenuListScreen;
