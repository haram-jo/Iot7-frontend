import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import {API_URL} from '@env';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';

const {width, height} = Dimensions.get('window');

const LocalMenuAlert = ({visible, setVisible, onHideToday, onNeverShow}) => {
  const [menuInfo, setMenuInfo] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Product'>>();

  const onGoToMenuPage = async () => {
    if (!menuInfo?.menuId) return;

    {
    }
    // ✅ 클릭 로그를 백엔드로 전송 ✅
    try {
      const response = await fetch(
        `${API_URL}/click/log?menuId=${menuInfo.menuId}`,
        {
          method: 'POST',
        },
      );
      const result = await response.text();
      console.log('🔥 지역추천 클릭 로그 응답:', result);
    } catch (error) {
      console.error('❌ 클릭 로그 전송 실패:', error);
    }

    setVisible(false);
    navigation.navigate('Product', {menuId: menuInfo.menuId});
  };

  // 위치 기반 해당 지역 전용 메뉴 불러오기
  useEffect(() => {
    const fetchLocalMenu = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const cityInfo = await Location.reverseGeocodeAsync(loc.coords);
      const city = cityInfo?.[0]?.city;
      if (city) {
        try {
          const res = await fetch(
            `${API_URL}/api/menus/only-location?keyword=${encodeURIComponent(
              city,
            )}`,
          );
          const data = await res.json();
          if (data.length > 0) {
            const randomMenu = data[Math.floor(Math.random() * data.length)];
            setMenuInfo({...randomMenu, city});
          } else {
            setIsError(true); // 데이터가 없을 때
          }
        } catch (err) {
          console.error('도시 기반 메뉴 요청 실패:', err);
          setIsError(true); // 에러 발생 시
        } finally {
          setIsLoading(false);
        }
      }
      // if (city) {
      //   try {
      //     const res = await fetch(
      //       `${API_URL}/api/menus/only-location?keyword=${encodeURIComponent(
      //         city,
      //       )}`,
      //     );
      //     const data = await res.json();
      //     if (data.length > 0) {
      //       const randomMenu = data[Math.floor(Math.random() * data.length)];
      //       setMenuInfo({...randomMenu, city});
      //     }
      //   } catch (err) {
      //     console.error('도시 기반 메뉴 요청 실패:', err);
      //   }
      // }
    };
    if (visible) {
      fetchLocalMenu();
    }
  }, [visible]);

  useEffect(() => {
    console.log('------------------- 받아온 메뉴 정보-------------', menuInfo);
  }, [menuInfo]);

  if (isLoading && visible) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={GlobalStyles.alertModalOverlay}>
          <View style={GlobalStyles.alertModalBox}>
            <Text style={{textAlign: 'center'}}>불러오는 중입니다...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (isError && visible) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={GlobalStyles.alertModalOverlay}>
          <View style={GlobalStyles.alertModalBox}>
            <Text style={{textAlign: 'center'}}>
              지역 기반 메뉴를 불러오지 못했어요 😢
            </Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{marginTop: 10}}>
              <Text style={{textAlign: 'center', color: 'blue'}}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  // menuInfo가 없고 로딩 중/에러도 아니면 아무것도 안 띄움
  if (!menuInfo || !visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={GlobalStyles.alertModalOverlay}>
        <View style={GlobalStyles.alertModalBox}>
          {/* ✅ 배경 이미지를 DB에서 받아온 이미지 주소로 표시 */}
          <Image
            source={{uri: menuInfo.imageUrl}}
            style={GlobalStyles.modalBannerImage}
          />
          {/* ✅ 닫기 버튼 */}
          <TouchableOpacity
            style={GlobalStyles.closeIcon}
            onPress={() => setVisible(false)}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {/* ✅ 텍스트 */}
          <View style={GlobalStyles.modalTextContainer}>
            <Text style={GlobalStyles.alertModalTitle}>
              '{menuInfo.city}'에서만 먹을 수 있는 메뉴!
            </Text>
            <Text style={GlobalStyles.subtitle}>
              지금 '{menuInfo.brand}'에서 파는{' '}
              <Text style={GlobalStyles.highlightedMenuName}>
                '{menuInfo.menuName}'
              </Text>{' '}
              를 만나보세요!
            </Text>
          </View>

          <TouchableOpacity
            style={GlobalStyles.primaryButton}
            onPress={onGoToMenuPage}>
            <Text style={GlobalStyles.primaryButtonText}>메뉴 보러 가기</Text>
          </TouchableOpacity>
          {/* ✅ 사용자 선택 버튼 */}
          <View style={GlobalStyles.alertModalButtons}>
            <TouchableOpacity onPress={onHideToday}>
              <Text style={GlobalStyles.alertModalButton}>
                오늘은 그만 보기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNeverShow}>
              <Text style={GlobalStyles.alertModalButton}>
                다시는 보지 않기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocalMenuAlert;
