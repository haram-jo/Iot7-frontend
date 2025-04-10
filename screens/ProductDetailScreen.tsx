import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainStack';
import {API_URL} from '@env';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';

type ProductRouteProp = RouteProp<RootStackParamList, 'Product'>;

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductRouteProp>();
  const {menuId} = route.params;

  const [menuDetail, setMenuDetail] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);

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

  if (!menuDetail) return <Text style={styles.loading}>로딩중...</Text>;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 이미지 + 찜버튼 */}
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

        {/* 브랜드 */}
        <Text style={styles.brandText}>
          {menuDetail.businessName} 브랜드 &gt;
        </Text>

        {/* 이름 + 별점 */}
        <View style={styles.nameAndStar}>
          <Text style={styles.menuName}>{menuDetail.menuName}</Text>
          <Text style={styles.stars}>
            ⭐ {menuDetail.averageRating?.toFixed(1)}
          </Text>
        </View>

        {/* 설명 */}
        <Text style={styles.description}>{menuDetail.description}</Text>

        {/* 요약 정보 (칼로리, 중량, 출시일, 가격) */}
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

        {/* 브랜드 인기상품 */}
        <Text style={styles.sectionTitle}>이 브랜드의 인기상품</Text>
        <View style={styles.rowCards}>
          {[...Array(3)].map((_, idx) => (
            <View key={idx} style={styles.card} />
          ))}
        </View>

        {/* 추천 메뉴 */}
        <Text style={styles.sectionTitle}>다른 추천 메뉴</Text>
        <View style={styles.rowCards}>
          {[...Array(3)].map((_, idx) => (
            <View key={idx} style={styles.card} />
          ))}
        </View>
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
});

export default ProductDetailScreen;
