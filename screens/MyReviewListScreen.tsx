import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
import {getStoredUserData} from '../services/auth';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {TouchableWithoutFeedback} from 'react-native';
const options = ['좋음', '보통', '별로'];

const MyReviewListScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [editedTaste, setEditedTaste] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [editedWouldVisitAgain, setEditedWouldVisitAgain] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const userData = await getStoredUserData();
      const res = await axios.get(
        `${API_URL}/api/reviews/user/${userData.userId}`,
      );
      setReviews(res.data);
    } catch (e) {
      console.error('리뷰 가져오기 실패', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/reviews/${selectedReview.menuId}/${selectedReview.userId}`,
      );
      Alert.alert('리뷰 삭제 완료');
      setSelectedReview(null);
      fetchReviews();
    } catch (e) {
      console.error('리뷰 삭제 실패', e);
      Alert.alert('삭제 실패');
    }
  };

  const handleUpdateReview = async () => {
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        menuId: selectedReview.menuId,
        userId: selectedReview.userId,
        reviewContent: editedContent,
        reviewRating: editedRating,
        taste: editedTaste,
        amount: editedAmount,
        wouldVisitAgain: editedWouldVisitAgain,
      });
      Alert.alert('리뷰 수정 완료');
      setSelectedReview(null);
      fetchReviews();
    } catch (e) {
      console.error('리뷰 수정 실패', e);
      Alert.alert('수정 실패');
    }
  };

  const renderOptionSelector = (label, value, onChange) => (
    <View style={styles.optionGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.optionButton,
              value === opt && styles.optionButtonSelected,
            ]}>
            <Text
              style={[
                styles.optionText,
                value === opt && styles.optionTextSelected,
              ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.backHeaderAlignedLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>📝 내가 작성한 리뷰</Text>
        </View>

        {reviews.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.reviewItem}
            onPress={() => {
              setSelectedReview(item);
              setEditedContent(item.reviewContent);
              setEditedRating(item.reviewRating);
              setEditedTaste(item.taste ?? '보통');
              setEditedAmount(item.amount ?? '보통');
              setEditedWouldVisitAgain(item.wouldVisitAgain ?? '보통');
            }}>
            <Text style={styles.menuName}>
              🍽 {item.menuName ?? '메뉴 없음'}
            </Text>
            <Text style={styles.reviewContent}>⭐ {item.reviewRating}점</Text>
            <Text style={styles.reviewContent}>💬 {item.reviewContent}</Text>
            {item.taste && (
              <Text style={styles.reviewContent}>🥄 맛: {item.taste}</Text>
            )}
            {item.amount && (
              <Text style={styles.reviewContent}>🍚 양: {item.amount}</Text>
            )}
            {item.wouldVisitAgain && (
              <Text style={styles.reviewContent}>
                🔁 재방문 의사: {item.wouldVisitAgain}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedReview} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedReview(null)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                {selectedReview && (
                  <>
                    <Text style={styles.modalTitle}>
                      📌 "{selectedReview.menuName}" 리뷰 수정하기
                    </Text>

                    <Text style={styles.label}>⭐ 별점</Text>
                    <StarRating
                      rating={editedRating}
                      onChange={setEditedRating}
                      starSize={30}
                    />

                    <Text style={styles.label}>✍ 리뷰 내용</Text>
                    <TextInput
                      value={editedContent}
                      onChangeText={setEditedContent}
                      multiline
                      style={styles.editInput}
                    />

                    {renderOptionSelector('🥄 맛', editedTaste, setEditedTaste)}
                    {renderOptionSelector(
                      '🍚 양',
                      editedAmount,
                      setEditedAmount,
                    )}
                    {renderOptionSelector(
                      '🔁 재방문 의사',
                      editedWouldVisitAgain,
                      setEditedWouldVisitAgain,
                    )}

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[
                          styles.modalButton,
                          {backgroundColor: '#ff6666'},
                        ]}
                        onPress={handleDeleteReview}>
                        <Text style={styles.modalButtonText}>삭제</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.modalButton,
                          {backgroundColor: '#3366ff'},
                        ]}
                        onPress={handleUpdateReview}>
                        <Text style={styles.modalButtonText}>수정</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedReview(null)}>
                      <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff', paddingHorizontal: 20},
  loading: {flex: 1, textAlign: 'center', marginTop: 100, fontSize: 16},
  backHeaderAlignedLeft: {paddingLeft: 0, paddingTop: 12},
  headerContainer: {alignItems: 'center', marginTop: 16, marginBottom: 20},
  header: {fontSize: 22, fontWeight: 'bold'},
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuName: {fontSize: 18, fontWeight: 'bold'},
  reviewContent: {marginTop: 4, fontSize: 14, color: '#333'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {marginTop: 12, fontWeight: '600', fontSize: 15, color: '#333'},
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  optionGroup: {
    marginTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#3366ff',
  },
  optionText: {
    fontSize: 14,
    color: '#555',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  closeButton: {
    backgroundColor: '#aaa',
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default MyReviewListScreen;
