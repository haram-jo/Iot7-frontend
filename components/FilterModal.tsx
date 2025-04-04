import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '@env';


const { height } = Dimensions.get('window');

interface FilterModalProps { //Props는 부모
  visible: boolean; // 모달 보이기 여부
  onClose: () => void; // 모달 닫기 함수
  onApply: (filters: any) => void; // 필터 적용 함수
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [selectedSort, setSelectedSort] = useState<string>(''); // ✅ 정렬 기준 (하나만 선택)
  const [ingredientKeyword, setIngredientKeyword] = useState(''); // ✅ 포함할 재료 키워드
  const [excludeKeyword, setExcludeKeyword] = useState(''); // ✅ 제외할 재료 키워드


  // ✅ 적용 버튼 눌렀을 때 실행되는 함수
  const applyFilters = () => {
    onApply({ selectedSort, ingredientKeyword,excludeKeyword});
    onClose();
  };


  // ✅ 정렬 기준 목록 (다이어터 제품 포함!)
  const sortOptions = [
    '가격 낮은 순',
    '가격 높은 순',
    '인기순', 
    '다이어트 순',
    '신상순',
   
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <Text style={styles.title}>필터</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>

            
          </View>

          {/* ✅ 정렬 기준 영역 */}
          <Text style={styles.sectionTitle}>정렬 기준</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => setSelectedSort(option)}
            >
              <Icon
                name={selectedSort === option ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color="#6200EE"
                style={{ marginRight: 8 }}
              />
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}


          {/* ✅ 재료 포함 키워드 입력 */}
          <Text style={styles.sectionTitle}>재료 포함 키워드</Text>
          <TextInput
            placeholder="예: 아이러브망고"
            value={ingredientKeyword}
            onChangeText={setIngredientKeyword}
            style={styles.input}
            />
            
             {/* ✅ 재료 out 키워드 입력 */}
            <Text style={styles.sectionTitle}>이 성분은 빼고 검색해줘!</Text>
            <TextInput
              placeholder="예: 민트초코"
              value={excludeKeyword}
              onChangeText={setExcludeKeyword}
              style={styles.input}
          />

          {/* ✅ 적용 버튼 */}
          <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>적용하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: height * 0.55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default FilterModal;
