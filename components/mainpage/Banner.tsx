import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, Image, ActivityIndicator} from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import {API_URL} from '@env';
import * as Location from 'expo-location';
import Carousel from 'react-native-reanimated-carousel';

const {width, height} = Dimensions.get('window');

const Banner = () => {
  const [menus, setMenus] = useState([]);
  const [bgColors, setBgColor] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  //위치기반 메뉴 불러오기
  useEffect(() => {
    const fetchBannerMenu = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const cityInfo = await Location.reverseGeocodeAsync(loc.coords);
      const city = cityInfo?.[0]?.city;
      console.log(city);
      // 현재 위치 기반 메뉴 목록 menu배열 안에 저장
      if (city) {
        const res = await fetch(
          `${API_URL}/api/menus/by-location?keyword=${encodeURIComponent(
            city,
          )}`,
        );
        const rawData = await res.json(); // 이름을 rawData로 바꿈
        const data = Array.isArray(rawData) ? rawData : []; // ✅ 배열 아니면 빈 배열로!

        // city를 주입해서 저장
        const enrichedData = data.map(menu => ({
          //스프레드 연산자(menu 객체 안에 있는 모든 속성들을 복사)
          ...menu,
          city, // 도시명 추가
        }));
        setMenus(enrichedData);
      }
    };
    fetchBannerMenu();
  }, []);
  if (menus.length === 0) {
    return <ActivityIndicator size="large" color="#666" />;
  }

  // useEffect(() => {
  //   fetch(`${API_URL}/banner`)
  //     .then(res => res.json())
  //     .then(data => setBannerItems(data))
  //     .catch(err => console.error('베너 데이터 불러오기 실패:', err));
  // }, []);
  return (
    <View style={GlobalStyles.wrapper}>
      <Carousel
        width={width}
        height={height * 0.18}
        autoPlay
        autoPlayInterval={3000}
        data={menus}
        scrollAnimationDuration={800}
        onSnapToItem={setCurrentIndex}
        renderItem={({item}) => {
          const bgColor = bgColors[item.menuId] ?? '#ffffff';
          return (
            <View style={[GlobalStyles.banner, {backgroundColor: bgColor}]}>
              <View style={GlobalStyles.textBox}>
                <Text style={GlobalStyles.title}>
                  '{item.city}'에서만 먹을 수 있는 메뉴!
                </Text>
                <Text style={GlobalStyles.subtitle}>
                  '{item.brand}'에서 파는{' '}
                  <Text style={GlobalStyles.highlightedMenuName}>
                    '{item.menuName}'
                  </Text>
                  는 어떠신가요?
                </Text>
              </View>
              <Image
                source={{uri: item.imageUrl}}
                style={GlobalStyles.bannerImage}
                resizeMode="contain"
              />
            </View>
          );
        }}
      />
      <Text style={GlobalStyles.pageIndicator}>
        {currentIndex + 1}/{menus.length}
      </Text>
    </View>
  );
};

export default Banner;
