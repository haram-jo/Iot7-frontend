import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getStoredUserData} from '../services/auth';
import {UserData} from '../types/UserData'; // 경로는 실제 위치에 따라 조정
const MyPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getStoredUserData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 프로필</Text>
      <View style={styles.separator} />
      {userData ? (
        <>
          <Text style={styles.userName}>{userData.userName}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>🍽️ 좋아하는 음식</Text>
          <Text style={styles.infoText}>{userData.preferredFood}</Text>

          <Text style={styles.sectionTitle}>🚫 알레르기 음식</Text>
          <Text style={styles.infoText}>{userData.allergicFood}</Text>
        </>
      ) : (
        <Text style={styles.loading}>유저 정보를 불러오는 중...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
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
});

export default MyPage;
