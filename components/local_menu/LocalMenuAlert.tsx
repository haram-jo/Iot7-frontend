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

const {width, height} = Dimensions.get('window');

const LocalMenuAlert = ({visible, setVisible, onHideToday, onNeverShow}) => {
  const [menuInfo, setMenuInfo] = useState(null);

  // 위치 기반으로 메뉴 불러오기
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
            `${API_URL}/api/menus/by-location?keyword=${encodeURIComponent(
              city,
            )}`,
          );
          const data = await res.json();
          if (data.length > 0) {
            const randomMenu = data[Math.floor(Math.random() * data.length)];
            setMenuInfo({...randomMenu, city});
          }
        } catch (err) {
          console.error('도시 기반 메뉴 요청 실패:', err);
        }
      }
    };
    if (visible) {
      fetchLocalMenu();
    }
  }, [visible]);

  if (!menuInfo) {
    return null;
  }
  useEffect(() => {
    console.log('✅ 받아온 메뉴 정보:', menuInfo);
  }, [menuInfo]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={GlobalStyles.modalOverlay}>
        <View style={GlobalStyles.modalBox}>
          {/* ✅ 배경 이미지를 DB에서 받아온 이미지 주소로 표시 */}
          <Image
            source={{uri: menuInfo.imageUrl}}
            style={GlobalStyles.modalBackgroundImage}
          />

          {/* ✅ 닫기 버튼 */}
          <TouchableOpacity
            style={GlobalStyles.alertCloseButton}
            onPress={() => setVisible(false)}>
            {/* <Image
              source={require('')}
              style={GlobalStyles.closeIcon}
            /> */}
          </TouchableOpacity>

          {/* ✅ 지역 기반 신상 메뉴 알림 텍스트 */}
          <View style={GlobalStyles.modalTextContainer}>
            <Text style={GlobalStyles.alertModalTitle}>
              '{menuInfo.city}'에서만 먹을 수 있는 메뉴!
            </Text>
            <Text style={GlobalStyles.subtitle}>
              지금 '{menuInfo.brand}'에서 파는{' '}
              <Text style={GlobalStyles.highlightedMenuName}>
                '{menuInfo.menuName}'{' '}
              </Text>
              를 만나보세요!
            </Text>
          </View>

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
