import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getStoredUserData} from '../services/auth';
import {UserData} from '../types/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/MainStack';

const EditProfile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userId, setUserId] = useState('');
  const [preferredFood, setPreferredFood] = useState('');
  const [allergicFood, setAllergicFood] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const data: UserData | null = await getStoredUserData();
      if (data) {
        setUserId(data.userId);
        setPreferredFood(data.preferredFood || '');
        setAllergicFood(data.allergicFood || '');
      }
    };
    loadUserData();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('❌ 오류', '유저 ID가 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, preferredFood, allergicFood}),
      });

      if (response.ok) {
        // ✅ AsyncStorage 업데이트
        const existing = await getStoredUserData();
        if (existing) {
          const updated = {
            ...existing,
            preferredFood,
            allergicFood,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(updated));
        }

        // ✅ Alert 안전하게 호출 & 뒤로가기
        setTimeout(() => {
          Alert.alert('✅ 수정 완료', '프로필이 성공적으로 수정되었습니다.');
          navigation.goBack(); // 또는 navigation.navigate('MyPage', {refresh: true});
        }, 100);
      } else {
        const errorText = await response.text();
        Alert.alert('❌ 수정 실패', errorText);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('서버 오류', '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 뒤로가기 버튼 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>프로필 수정</Text>

      <Text style={styles.label}>좋아하는 음식</Text>
      <TextInput
        style={styles.input}
        value={preferredFood}
        onChangeText={setPreferredFood}
        placeholder="예: 파스타, 치킨"
      />

      <Text style={styles.label}>알레르기 음식</Text>
      <TextInput
        style={styles.input}
        value={allergicFood}
        onChangeText={setAllergicFood}
        placeholder="예: 땅콩, 갑각류"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 24, backgroundColor: '#fff', flex: 1},
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  label: {fontSize: 16, fontWeight: 'bold', marginTop: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#3366ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
