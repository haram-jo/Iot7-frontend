import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Dimensions} from 'react-native';
import {Linking} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

// ✅ 변하지않는 const값은 밖에 적어줌
const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4; // 블로그 리뷰 개수 조정
const SPACING = 10;

// ✅ 타입 지정
type ProductRouteProp = RouteProp<RootStackParamList, 'Product'>;

// ✅ 상품 상세 페이지
const ProductDetailScreen = () => {
  type Navigation = NativeStackNavigationProp<RootStackParamList>; // ✅ 네비 타입 지정
  const navigation = useNavigation<Navigation>(); // ✅ 네비 타입 가져오기
  const route = useRoute<ProductRouteProp>();
  const {menuId} = route.params; // ✅ menuId 받아오기
  const [nearestStores, setNearestStores] = useState([]); // ✅ 가까운 매장
  const [userLocation, setUserLocation] = useState(null); // ✅ 내 위치
  const mapRef = useRef(null); // ✅ 지도 ref 만들기

  const [menuDetail, setMenuDetail] = useState<any>(null); // ✅ 상품 정보 저장 state
  const [isLiked, setIsLiked] = useState(false); // ✅ 찜하기 상태 저장 (하트 눌렀는지)

  // ✅ 상세정보 API 호출
  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/menu/${menuId}`);
        const data = await response.json();
        setMenuDetail(data);
      } catch (error) {
        console.error('메뉴 상세 조회 오류:', error);
      }
    };
    fetchMenuDetail();
  }, [menuId]);

  // ✅ 현재 내 위치 + 가까운 매장 API 요청
  useEffect(() => {
    const fetchNearestStores = async () => {
      try {
        // 1. 위치 권한 요청
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('위치 권한이 거부되었습니다');
          return;
        }

        // 2. 현재 위치 가져오기
        const location = await Location.getCurrentPositionAsync({});
        const {latitude, longitude} = location.coords;
        setUserLocation({latitude, longitude});

        // 3. 가까운 매장 API 요청
        const response = await fetch(
          `${API_URL}/pos/nearest?brandName=${encodeURIComponent(
            menuDetail.businessName,
          )}&userLat=${latitude}&userLng=${longitude}`,
        );
        const data = await response.json();
        setNearestStores(data); // ✅ 가까운 매장 목록 저장
      } catch (error) {
        console.error('가까운 매장 조회 오류:', error);
      }
    };

    if (menuDetail?.businessName) {
      fetchNearestStores();
    }
  }, [menuDetail]);

  if (!menuDetail) return <Text style={styles.loading}>로딩중...</Text>;

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* ✅ 상단 헤더 영역 - 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* ✅ 전체 내용을 스크롤할 수 있도록 감쌈 */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ 상품 이미지 + 찜하기 버튼 (우측 상단 하트) */}
        <View style={styles.imageWrapper}>
          <Image source={{uri: menuDetail.imageUrl}} style={styles.mainImage} />
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => setIsLiked(!isLiked)}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#e74c3c' : '#aaa'}
            />
          </TouchableOpacity>
        </View>

        {/* ✅ 브랜드명 표시 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BrandMenuList', {
              brandName: menuDetail.businessName,
            })
          }>
          <Text style={styles.brandText}>
            {menuDetail.businessName} 브랜드 &gt;
          </Text>
        </TouchableOpacity>

        {/* ✅ 제품 이름 + 별점 (가로 정렬) */}
        <View style={styles.nameAndStar}>
          <Text style={styles.menuName}>{menuDetail.menuName}</Text>
          <Text style={styles.stars}>
            ⭐ {menuDetail.averageRating?.toFixed(1)}
          </Text>
        </View>

        {/* ✅ 제품 설명 */}
        <Text style={styles.description}>{menuDetail.description}</Text>

        {/* ✅ 요약 정보 테이블: 가격, 칼로리,중량, 출시일 */}
        <View style={styles.summaryTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>가격</Text>
            <Text style={styles.tableHeader}>칼로리</Text>
            <Text style={styles.tableHeader}>중량</Text>
            <Text style={styles.tableHeader}>출시일</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{menuDetail.price}원</Text>
            <Text style={styles.tableCell}>{menuDetail.calorie} kcal</Text>
            <Text style={styles.tableCell}>200g</Text>
            <Text style={styles.tableCell}>2025.05</Text>
          </View>
        </View>

        {/* ✅ 이 브랜드의 인기상품 */}
        <Text style={styles.sectionTitle}>이 브랜드의 인기상품</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalCards}>
            {[...Array(6)].map((_, idx) => (
              <View key={idx} style={styles.card} />
            ))}
          </View>
        </ScrollView>

        {/* ✅ 다른 추천 메뉴 */}
        <Text style={styles.sectionTitle}>다른 추천 메뉴</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalCards}>
            {[...Array(6)].map((_, idx) => (
              <View key={idx} style={styles.card} />
            ))}
          </View>
        </ScrollView>

        {/* ✅ 블로그존 ✅ */}
        <Text style={styles.sectionTitle}>블로그 리뷰</Text>
        {menuDetail.blogPosts && menuDetail.blogPosts.length > 0 ? (
          <FlatList
            data={menuDetail.blogPosts}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + SPACING}
            decelerationRate="fast"
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingHorizontal: 10}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.link)}
                style={[
                  styles.blogCard,
                  {width: ITEM_WIDTH, marginRight: SPACING},
                ]}>
                <Text style={styles.blogTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.blogDesc} numberOfLines={1}>
                  by {item.bloggerName}
                </Text>
                <Text style={styles.blogDate}>{item.postDate}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{color: '#999'}}>블로그 리뷰가 없습니다.</Text>
        )}

        {/* ✅ 유튜브존 ✅ */}
        <Text style={styles.sectionTitle}>유튜브 리뷰</Text>
        {menuDetail.youtubeVideos && menuDetail.youtubeVideos.length > 0 ? (
          <FlatList
            data={menuDetail.youtubeVideos}
            horizontal
            pagingEnabled
            snapToInterval={width * 0.6 + 11}
            decelerationRate="fast"
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 10}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.youtubeCard}
                onPress={() =>
                  Linking.openURL(
                    `https://www.youtube.com/watch?v=${item.videoId}`,
                  )
                }>
                <Image
                  source={{uri: item.thumbnailUrl}}
                  style={styles.youtubeThumbnail}
                />
                <Text numberOfLines={2} style={styles.youtubeTitle}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{color: '#999'}}>유튜브 리뷰가 없습니다.</Text>
        )}

        {/* ✅ 가까운 매장 지도 표시 */}
        <Text style={styles.sectionTitle}>가까운 매장 위치</Text>
        {userLocation && nearestStores.length > 0 ? (
          <View>
            <MapView
              ref={mapRef}
              style={{
                width: '100%',
                height: 300,
                marginTop: 10,
                borderRadius: 10,
              }}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={userLocation}
                title="내 위치"
                pinColor="blue"
              />
              {nearestStores.map((store, idx) => (
                <Marker
                  key={idx}
                  coordinate={{
                    latitude: store.latitude,
                    longitude: store.longitude,
                  }}
                  title={`${store.businessName} ${store.location}`}
                  description="가까운 매장"
                />
              ))}
            </MapView>

            {/* ✅ 내 위치로 되돌아가는 버튼 */}
            <TouchableOpacity
              onPress={() => {
                if (mapRef.current && userLocation) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    1000,
                  );
                }
              }}
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'white',
                borderRadius: 30,
                padding: 8,
                elevation: 5,
              }}>
              <Ionicons name="locate" size={36} color="#007aff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{color: '#999'}}>
            가까운 매장을 불러오는 중입니다...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: '#fff'},
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
  },
  brandText: {
    color: '#777',
    marginBottom: 6,
  },
  nameAndStar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  stars: {
    fontSize: 16,
    color: '#f1c40f',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  summaryTable: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 4,
  },
  reviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
  reviewText: {
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    color: '#aaa',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: 90,
    height: 90,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  horizontalCards: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
    paddingRight: 10,
    // 가로 스크롤 위해 추가로 넣어준 코드
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  blogTitle: {
    fontSize: 16, // 제목 크기 (조정 가능)
    fontWeight: 'bold',
    color: '#333',
  },

  blogDesc: {
    fontSize: 14, // 설명 크기 (조정 가능)
    color: '#666',
    lineHeight: 20, // 줄 간격 (옵션)
  },

  blogImage: {
    width: 64, // 이미지 크기 설정
    height: 64, // 이미지 크기 설정
    borderRadius: 8, // 이미지 모서리 둥글게
    backgroundColor: '#ccc', // 이미지 배경색
  },
  blogCard: {
    width: width * 0.4,
    backgroundColor: '#F5EBFF',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  youtubeCard: {
    width: width * 0.6,
    marginRight: 12,
    backgroundColor: '#FFFCF3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  youtubeThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  youtubeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  youtubeLink: {
    fontSize: 12,
    color: '#007aff',
    textAlign: 'right',
  },
});

export default ProductDetailScreen;
