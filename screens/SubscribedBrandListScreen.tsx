import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {AuthContext} from '../contexts/AuthContext';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/MainStack';

const {width} = Dimensions.get('window');
type Navigation = NativeStackNavigationProp<RootStackParamList>;

const MyFavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'brand'>('menu');
  const [brands, setBrands] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const {user} = useContext(AuthContext);
  const navigation = useNavigation<Navigation>();

  useEffect(() => {
    if (activeTab === 'brand') {
      fetchSubscribedBrands();
    } else if (activeTab === 'menu') {
      fetchSubscribedMenus();
    }
  }, [activeTab]);

  const fetchSubscribedMenus = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/menu-subscribe/list?userId=${user.userId}`,
      );
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error('찜한 메뉴 불러오기 실패:', error);
    }
  };

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

  const unsubscribeMenu = async (menuId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/menu-subscribe`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: user.userId, menuId}),
      });
      const isSubscribed = await res.json();
      if (!isSubscribed) {
        setMenus(prev => prev.filter(m => m.menuId !== menuId));
      }
    } catch (err) {
      console.error('구독 해제 실패:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY 찜</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'menu' && styles.activeTab]}
          onPress={() => setActiveTab('menu')}>
          <Text style={styles.tabText}>찜한 아이템</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'brand' && styles.activeTab]}
          onPress={() => setActiveTab('brand')}>
          <Text style={styles.tabText}>찜한 브랜드</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'menu' && (
        <View style={styles.countEditRow}>
          <Text style={styles.countText}>
            전체 <Text style={styles.countNumber}>{menus.length}</Text>개
          </Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editText}>✂ 편집</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentArea}>
        {activeTab === 'menu' ? (
          <FlatList
            data={menus}
            keyExtractor={item => item.menuId.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Product', {menuId: item.menuId})
                }
                style={styles.menuCard}>
                <Image source={{uri: item.imageUrl}} style={styles.menuImage} />
                <View style={styles.menuInfo}>
                  <Text style={styles.menuBrand}>
                    {item.brandName || '브랜드명'}
                  </Text>
                  <Text style={styles.menuName}>{item.menuName}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>
                      {item.price ? item.price.toLocaleString() + '원' : ''}
                    </Text>
                    {item.discountRate && (
                      <Text style={styles.discount}>{item.discountRate}%</Text>
                    )}
                  </View>
                </View>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => unsubscribeMenu(item.menuId)}
                    style={styles.unsubscribeButton}>
                    <Ionicons name="close-circle" size={24} color="#ff3333" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>찜한 메뉴가 없습니다.</Text>
            }
          />
        ) : (
          <FlatList
            data={brands}
            keyExtractor={item => item.businessId.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.brandItem}
                onPress={() =>
                  navigation.navigate('BrandMenuList', {
                    brandName: item.brandName,
                    businessId: item.businessId,
                  })
                }>
                <Text style={styles.brandText}>{item.brandName}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>구독한 브랜드가 없습니다.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  backButton: {position: 'absolute', left: 16, padding: 4, zIndex: 10},
  editText: {fontSize: 14, color: '#3366ff'},
  headerTitle: {fontSize: 20, fontWeight: 'bold'},
  tabRow: {flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd'},
  tabItem: {flex: 1, paddingVertical: 12, alignItems: 'center'},
  activeTab: {borderBottomWidth: 2, borderColor: '#000'},
  tabText: {fontSize: 14, fontWeight: '600'},
  countEditRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {fontSize: 14, color: '#333'},
  countNumber: {fontWeight: 'bold', color: '#3366ff'},
  contentArea: {flex: 1, paddingHorizontal: 16},
  brandItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  brandText: {fontSize: 16, color: '#007AFF'},
  empty: {textAlign: 'center', color: '#999', marginTop: 50},
  menuCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuBrand: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
  },
  menuName: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: '#ff4d00',
  },
  unsubscribeButton: {padding: 8},
});

export default MyFavoritesScreen;
