import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import StarTapRating from './StarDragRating';
import ReviewImageUploader from './PhotoUpload';
import {API_URL} from '@env';

interface MenuDTO {
  menuId: number;
  menuName: string;
}

interface Props {
  menuName: string;
  imageUrl: string;
  rating: number;
  setRating: (val: number) => void;
  content: string;
  setContent: (val: string) => void;
  taste: string;
  setTaste: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  wouldVisitAgain: string;
  setWouldVisitAgain: (val: string) => void;
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  onSubmit: () => void;
  onPickImage: () => void;
  verified: boolean;
  pairedMenuId: number | null;
  setPairedMenuId: (id: number) => void;
  combinationContent: string;
  setCombinationContent: (val: string) => void;
  errors: {taste: boolean; amount: boolean; wouldVisitAgain: boolean};
}

const ReviewForm = ({
  menuName,
  imageUrl,
  rating,
  setRating,
  content,
  setContent,
  taste,
  setTaste,
  amount,
  setAmount,
  wouldVisitAgain,
  setWouldVisitAgain,
  imageUrls,
  setImageUrls,
  onSubmit,
  onPickImage,
  verified,
  pairedMenuId,
  setPairedMenuId,
  combinationContent,
  setCombinationContent,
  errors,
}: Props) => {
  const [comboSearch, setComboSearch] = useState('');
  const [comboResults, setComboResults] = useState<MenuDTO[]>([]);

  const hasErrors = (errors: {[key: string]: boolean}) =>
    Object.values(errors).some(Boolean);

  const handleSearchCombo = async (text: string) => {
    setComboSearch(text);
    if (text.trim().length === 0) return setComboResults([]);
    try {
      const res = await fetch(`${API_URL}/menu/search?keyword=${text}`);
      const data = await res.json();
      setComboResults(data);
    } catch (e) {
      console.error('콤보 메뉴 검색 실패', e);
    }
  };

  const renderChoiceGroup = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    error?: boolean,
  ) => (
    <View style={styles.choiceGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.choiceRow}>
        {['별로', '보통', '좋음'].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              value === option && styles.choiceSelected,
            ]}
            onPress={() => setValue(option)}>
            <Text style={styles.choiceText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>필수 선택 항목입니다.</Text>}
    </View>
  );

  return (
    <View>
      <Image
        source={{uri: imageUrl}}
        style={styles.menuImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>📝 {menuName} 리뷰 작성</Text>

      <StarTapRating rating={rating} setRating={setRating} />
      {renderChoiceGroup('맛은 어땠나요?', taste, setTaste, errors.taste)}
      {renderChoiceGroup(
        '양은 만족스러웠나요?',
        amount,
        setAmount,
        errors.amount,
      )}
      {renderChoiceGroup(
        '재구매 의사',
        wouldVisitAgain,
        setWouldVisitAgain,
        errors.wouldVisitAgain,
      )}

      <Text style={styles.label}>리뷰 내용:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
        placeholder="리뷰를 작성해 주세요"
      />

      {/* 🔍 콤보 추천 메뉴 검색 */}
      <Text style={styles.label}>같이 먹으면 좋은 메뉴 검색</Text>
      <TextInput
        style={styles.input}
        value={comboSearch}
        onChangeText={handleSearchCombo}
        placeholder="메뉴명으로 검색"
      />
      {comboResults.map(item => (
        <TouchableOpacity
          key={item.menuId}
          style={styles.choiceButton}
          onPress={() => {
            setPairedMenuId(item.menuId);
            setComboSearch(item.menuName);
            setComboResults([]);
          }}>
          <Text style={styles.choiceText}>{item.menuName}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>추천 이유</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={combinationContent}
        onChangeText={setCombinationContent}
        multiline
        numberOfLines={3}
        placeholder="이 메뉴와 어울리는 이유를 작성해 주세요"
      />

      <Text style={styles.label}>포토</Text>
      <ReviewImageUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />
      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={verified}
        onPress={onPickImage}>
        <Text style={styles.buttonText}>영수증 인증</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, hasErrors(errors) && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={hasErrors(errors)}>
        <Text style={styles.buttonText}>리뷰 등록</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 24},
  label: {fontSize: 16, marginTop: 12, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#6C5CE7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  choiceGroup: {marginTop: 12},
  choiceRow: {flexDirection: 'row', gap: 8},
  choiceButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  choiceSelected: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  choiceText: {
    color: '#000',
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: '#A29BFE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ReviewForm;
