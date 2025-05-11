// screens/SubscribedBrandListScreen.tsx
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API_URL} from '@env';
import {AuthContext} from '../contexts/AuthContext';
import {Ionicons} from '@expo/vector-icons';

const {width} = Dimensions.get('window');
type Navigation = NativeStackNavigationProp<RootStackParamList>;

const SubscribedBrandListScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [brands, setBrands] = useState<any[]>([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscribedBrands = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/subscribe/list?userId=${user.userId}`,
        );
        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error('구독 브랜드 목록 불러오기 실패:', error);
      }
    };

    fetchSubscribedBrands();
  }, []);

  const handleBrandPress = (brand: any) => {
    navigation.navigate('BrandMenuList', {
      brandName: brand.brandName,
      businessId: brand.businessId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⭐ 구독한 브랜드</Text>
      </View>

      <FlatList
        data={brands}
        keyExtractor={(item, index) => item.businessId.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.brandItem}
            onPress={() => handleBrandPress(item)}>
            <Text style={styles.brandText}>{item.brandName}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>구독한 브랜드가 없습니다.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  brandItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  brandText: {
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});

export default SubscribedBrandListScreen;
