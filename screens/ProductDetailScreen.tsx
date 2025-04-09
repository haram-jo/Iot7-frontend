import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';

type ProductRouteProp = RouteProp<RootStackParamList, 'Product'>; ////route 타입 지정해주기기

const ProductDetailScreen = () => {
  const route = useRoute<ProductRouteProp>();
  const {menuId} = route.params; // ✅ SearchResultScreen에서 넘겨준 menuId를 받아옴

  const [menuDetail, setMenuDetail] = useState<any>(null); // ✅ API로 받아올 메뉴 정보 상태

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

  if (!menuDetail) return <Text style={styles.loading}>로딩중 .. </Text>; //추후 로딩 UI 수정

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 메뉴 이름 */}
      <Text style={styles.title}>{menuDetail.menuName}</Text>

      {/* 브랜드명 */}
      <Text style={styles.label}>브랜드: {menuDetail.businessName}</Text>

      {/* 가격 */}
      <Text style={styles.label}>
        가격: {menuDetail.price?.toLocaleString()}원
      </Text>

      {/* 카테고리 */}
      <Text style={styles.label}>카테고리: {menuDetail.category}</Text>

      {/* 칼로리 */}
      <Text style={styles.label}>칼로리: {menuDetail.calorie} kcal</Text>

      {/* 다이어트 여부 */}
      <Text style={styles.label}>
        다이어트용인가요? {menuDetail.dietYn ? '네' : '아니오'}
      </Text>

      {/* 설명 */}
      <Text style={styles.description}>설명: {menuDetail.description}</Text>

      {/* 추가로 이미지, 리뷰, 조합 등 연결 가능 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProductDetailScreen;
