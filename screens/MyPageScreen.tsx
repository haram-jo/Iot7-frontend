import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {getStoredUserData} from '../services/auth';
import {UserData} from '../types/UserData';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/MainStack';
const MyPage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getStoredUserData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>내 프로필</Text>
        <View style={styles.separator} />
        {userData ? (
          <>
            <Text style={styles.userName}>{userData.userName}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </>
        ) : (
          <Text style={styles.loading}>유저 정보를 불러오는 중...</Text>
        )}

        <View style={styles.separator} />
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('SubscribedBrandList')}>
            <MaterialIcons name="subscriptions" size={30} color="#3366ff" />
            <Text style={styles.iconLabel}>브랜드 구독</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart" size={30} color="#3366ff" />
            <Text style={styles.iconLabel}>찜 메뉴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('MyReviewList')}>
            <MaterialIcons name="rate-review" size={30} color="#3366ff" />
            <Text style={styles.iconLabel}>내 리뷰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="bell-ring"
              size={30}
              color="#3366ff"
            />
            <Text style={styles.iconLabel}>알림</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        {userData && (
          <>
            <Text style={styles.sectionTitle}>🍽️ 좋아하는 음식</Text>
            <Text style={styles.infoText}>{userData.preferredFood}</Text>

            <Text style={styles.sectionTitle}>🚫 알레르기 음식</Text>
            <Text style={styles.infoText}>{userData.allergicFood}</Text>
          </>
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* 고정 하단 버튼 */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>내정보 수정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#222',
    marginTop: 6,
  },
  loading: {
    fontSize: 16,
    color: '#999',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#333',
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3366ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyPage;
