import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, MapMarker} from 'react-native-maps';
import * as Location from 'expo-location';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styles, {ITEM_WIDTH, SPACING} from '../styles/ProductDetailStyles';

const {width} = Dimensions.get('window');

// ✅ 라우트 및 네비게이션 타입 정의
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>(); // ✅ 타입 명확히 지정
  const route = useRoute<any>();
  const {menuId} = route.params;
  const [popularMenus, setPopularMenus] = useState<any[]>([]);

  const [menuDetail, setMenuDetail] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [nearestStores, setNearestStores] = useState<any[]>([]);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<(MapMarker | null)[]>([]); // ✅ 지도 말풍선 자동 표시
  const userMarkerRef = useRef<MapMarker | null>(null);

  // ✅ 1. 상세 메뉴 정보 받아오기
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

  // ✅ 2.  내 위치 + 가까운 매장 불러오기
  useEffect(() => {
    const fetchNearestStores = async () => {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({});
        const {latitude, longitude} = location.coords;
        setUserLocation({latitude, longitude});

        const response = await fetch(
          `${API_URL}/pos/nearest?brandName=${encodeURIComponent(
            menuDetail.businessName,
          )}&userLat=${latitude}&userLng=${longitude}`,
        );
        const data = await response.json();
        setNearestStores(data);
      } catch (error) {
        console.error('가까운 매장 조회 오류:', error);
      }
    };

    if (menuDetail?.businessName) {
      fetchNearestStores();
    }
  }, [menuDetail]);

  // ✅ 3. 클릭수 기준 인기 메뉴 API 호출
  useEffect(() => {
    const fetchPopularMenus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/click/popular?brandName=${encodeURIComponent(
            menuDetail.businessName,
          )}`,
        );
        const data = await response.json();
        const filtered = data.filter((item: any) => item.menuId !== menuId);
        setPopularMenus(filtered); // 자기 자신 제외
      } catch (error) {
        console.error('인기 상품 불러오기 오류:', error);
      }
    };

    if (menuDetail?.businessName) {
      fetchPopularMenus();
    }
  }, [menuDetail]);

  // ✅ 4. 첫 번째 가까운 매장 말풍선 자동 표시
  useEffect(() => {
    if (nearestStores.length === 0) return;

    const tryShowFirstCallout = () => {
      const marker = markerRefs.current[0];
      if (marker && marker.showCallout) {
        marker.showCallout(); // ✅ 말풍선 띄움
      } else {
        // 아직 등록 안 됐을 경우, 재시도 (100ms 후에 또 시도)
        setTimeout(tryShowFirstCallout, 100);
      }
    };

    setTimeout(tryShowFirstCallout, 800);
  }, [nearestStores]);

  // ✅ 5. 현재 매장 바뀔 때 말풍선 띄우기
  useEffect(() => {
    const targetMarker = markerRefs.current[currentStoreIndex];
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.showCallout();
      }, 500);
    }
  }, [currentStoreIndex]);

  // ✅ 6. 말풍선 고정할수있는 기능! - 리엑트 map엔 없어서 강제 재실행해서 띄워놈
  useEffect(() => {
    const interval = setInterval(() => {
      const marker = markerRefs.current[currentStoreIndex];
      if (marker?.showCallout) {
        marker.showCallout(); // 반복적으로 띄움
      }
    }, 15000); // 5초마다 재실행

    return () => clearInterval(interval); // 컴포넌트 unmount 시 정리
  }, [currentStoreIndex]);

  if (!menuDetail) return <Text style={styles.loading}>로딩중...</Text>;

  // ✅ 7. 선택된 매장에서 다음 매장으로 지도 이동
  const goToNextStore = () => {
    if (nearestStores.length === 0) return; //  // 매장이 없으면 아무것도 안 함

    const nextIndex = (currentStoreIndex + 1) % nearestStores.length;
    setCurrentStoreIndex(nextIndex); // 다음 인덱스로 이동 (끝나면 다시 처음으로 순환)

    const nextStore = nearestStores[nextIndex];
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: nextStore.latitude,
          longitude: nextStore.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* 📍뒤로가기📍 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 📍대표 이미지 + 찜 버튼 📍*/}
      <ScrollView contentContainerStyle={styles.container}>
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

        {/*📍브랜드명 클릭 → 브랜드 메뉴로 이동📍*/}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BrandMenuList', {
              brandName: menuDetail.businessName,
              businessId: menuDetail.businessId, // ← 이게 꼭 필요해
            })
          }>
          <Text style={styles.brandText}>
            {menuDetail.businessName} 브랜드 &gt;
          </Text>
        </TouchableOpacity>
        {/*📍메뉴명 + 별점 📍*/}
        <View style={styles.nameAndStar}>
          <Text style={styles.menuName}>{menuDetail.menuName}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ReviewList', {
                menuId: menuId,
                menuName: menuDetail.menuName,
                imageUrl: menuDetail.imageUrl,
                brandName: menuDetail.businessName,
              })
            }>
            <Text style={styles.stars}>
              ⭐ {menuDetail.averageRating?.toFixed(1)}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{menuDetail.description}</Text>

        {/* 📍정보📍 */}
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

        {/* 📍클릭수 기준 인기상품📍 */}
        <Text style={styles.sectionTitle}>이 브랜드의 인기상품</Text>

        {popularMenus.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalCards}>
              {popularMenus.map((item, idx) => (
                <TouchableOpacity
                  key={item.menuId}
                  onPress={() =>
                    navigation.navigate('Product', {menuId: item.menuId})
                  }
                  style={styles.card}>
                  <View style={styles.imageFrame}>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={styles.zoomedImage}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={{color: '#888'}}>인기 상품이 없습니다.</Text>
        )}
        {/*📍추천메뉴 (임시 박스)📍 */}
        <Text style={styles.sectionTitle}>다른 추천 메뉴</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalCards}>
            {[...Array(6)].map((_, idx) => (
              <View key={idx} style={styles.card} />
            ))}
          </View>
        </ScrollView>
        {/*📍블로그 리뷰📍 */}
        <Text style={styles.sectionTitle}>블로그 리뷰</Text>
        {menuDetail.blogPosts?.length > 0 ? (
          <FlatList // 가로 스크롤 카드 형식으로 출력
            data={menuDetail.blogPosts}
            horizontal
            pagingEnabled
            snapToInterval={ITEM_WIDTH + SPACING}
            decelerationRate="fast"
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
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

        {/* 📍유튜브 리뷰📍 */}
        <Text style={styles.sectionTitle}>유튜브 리뷰</Text>
        {menuDetail.youtubeVideos?.length > 0 ? (
          <FlatList
            data={menuDetail.youtubeVideos}
            horizontal
            pagingEnabled
            snapToInterval={width * 0.6 + 11}
            decelerationRate="fast"
            keyExtractor={(_, index) => index.toString()}
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

        <Text style={styles.sectionTitle}>가까운 매장 위치</Text>
        {userLocation && nearestStores.length > 0 ? (
          <View>
            {userLocation.latitude && userLocation.longitude && (
              <MapView
                ref={mapRef}
                style={{
                  width: '100%',
                  height: 300,
                  marginTop: 10,
                  borderRadius: 10,
                }}
                initialRegion={{
                  // 첫 번째 매장 기준으로 지도 처음 위치 설정
                  latitude:
                    nearestStores[0]?.latitude ||
                    userLocation?.latitude ||
                    37.5665,
                  longitude:
                    nearestStores[0]?.longitude ||
                    userLocation?.longitude ||
                    126.978,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                // ✅ 맵이 준비되면 내 위치 말풍선 자동 띄우기
                onMapReady={() => {
                  setTimeout(() => {
                    userMarkerRef.current?.showCallout(); // ✅ 말풍선 표시
                  }, 500); // 렌더 완료 후 약간의 시간 차 줌
                }}>
                <Marker
                  ref={userMarkerRef} // ✅ ref 추가
                  coordinate={userLocation}
                  title="내 위치"
                  pinColor="blue"
                />
                {nearestStores.map((store, idx) => (
                  <Marker
                    key={idx}
                    ref={ref => (markerRefs.current[idx] = ref)} // ✅ ref 저장
                    coordinate={{
                      latitude: store.latitude,
                      longitude: store.longitude,
                    }}
                    title={store.location} // ✅ 위치 (말풍선 제목)
                    description={store.businessName} // ✅ 브랜드명 (말풍선 설명)
                  />
                ))}
              </MapView>
            )}

            {/*📍내 위치로 이동 버튼📍 */}
            <TouchableOpacity
              onPress={() => {
                if (mapRef.current && userLocation) {
                  // ✅ 현재 매장 인덱스 초기화
                  setCurrentStoreIndex(0);

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

            {/* 📍다음 매장으로 이동 버튼📍 */}
            <TouchableOpacity
              onPress={goToNextStore}
              style={{
                position: 'absolute',
                bottom: 70,
                right: 10,
                backgroundColor: 'white',
                borderRadius: 30,
                padding: 8,
                elevation: 5,
              }}>
              <Ionicons
                name="chevron-forward-circle"
                size={36}
                color="#28a745"
              />
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

export default ProductDetailScreen;
