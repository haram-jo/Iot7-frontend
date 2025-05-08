import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getStoredUserData} from '../services/auth';
import {submitReview} from '../services/review';
import ReviewForm from '../components/review/ReviewForm';
import {RootStackParamList} from '../navigation/MainStack';
import {Ionicons} from '@expo/vector-icons';
import {useImagePicker} from '../hooks/useImagePicker';

type ReviewWriteRouteProp = RouteProp<RootStackParamList, 'ReviewWrite'>;

interface ReviewFormErrors {
  taste: boolean;
  amount: boolean;
  wouldVisitAgain: boolean;
}

const ReviewWriteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ReviewWriteRouteProp>();
  const {menuId, menuName, imageUrl, brandName} = route.params;

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [taste, setTaste] = useState('');
  const [amount, setAmount] = useState('');
  const [wouldVisitAgain, setWouldVisitAgain] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [receiptVerified, setReceiptVerified] = useState(0);
  const [pairedMenuId, setPairedMenuId] = useState<number | null>(null);
  const [combinationContent, setCombinationContent] = useState('');
  const [errors, setErrors] = useState<ReviewFormErrors>({
    taste: false,
    amount: false,
    wouldVisitAgain: false,
  });

  const {pickImage} = useImagePicker(
    brandName,
    menuName,
    setLoading,
    setImageUrls,
    () => setReceiptVerified(1),
  );

  useEffect(() => {
    setErrors({
      taste: !taste,
      amount: !amount,
      wouldVisitAgain: !wouldVisitAgain,
    });
  }, [taste, amount, wouldVisitAgain]);

  const handleSubmit = async () => {
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) return;

    const userData = await getStoredUserData();
    if (!userData) {
      Alert.alert('로그인이 필요합니다.');
      return;
    }

    try {
      await submitReview({
        menuId,
        userId: userData.userId,
        reviewContent: content,
        reviewRating: rating,
        taste,
        amount,
        wouldVisitAgain,
        imageUrls,
        receiptVerified,
        pairedMenuId: pairedMenuId ?? undefined,
        combinationContent: combinationContent || undefined,
      });

      Alert.alert('리뷰가 등록되었습니다!');
      navigation.goBack();
    } catch (error) {
      console.error('\u274c 리뷰 등록 오류:', error);
      Alert.alert('리뷰 등록 중 오류 발생');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <SafeAreaView style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ReviewForm
            menuName={menuName}
            imageUrl={imageUrl}
            rating={rating}
            setRating={setRating}
            content={content}
            setContent={setContent}
            taste={taste}
            setTaste={setTaste}
            amount={amount}
            setAmount={setAmount}
            wouldVisitAgain={wouldVisitAgain}
            setWouldVisitAgain={setWouldVisitAgain}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            onSubmit={handleSubmit}
            onPickImage={pickImage}
            verified={receiptVerified === 1}
            pairedMenuId={pairedMenuId}
            setPairedMenuId={setPairedMenuId}
            combinationContent={combinationContent}
            setCombinationContent={setCombinationContent}
            errors={errors}
          />
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContent: {padding: 20, paddingBottom: 40},
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});

export default ReviewWriteScreen;
