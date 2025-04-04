import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { API_URL } from '@env';

interface BrandFilterModalProps { // 부모가 props 
  visible: boolean;  // 모달 보이기 여부
  onClose: () => void; // 모달 닫기 함수
  onSelectBrand: (brandName: string) => void; // 브랜드 선택시 실행할 함수
}

const BrandFilterModal: React.FC<BrandFilterModalProps> = ({ visible, onClose, onSelectBrand }) => {
  const [brands, setBrands] = useState<string[]>([]);


  // ✅ 브랜드 필터링할때 브랜드 목록을 프론트에 가져오기
  useEffect(() => { //상태나 값이 바뀔때, 특정 동작을 실행하고 싶을때
    if (visible) { // visible ==true 와 같은 의미 
      fetch(`${API_URL}/brand/list`)
        .then((res) => res.json())
        .then((data) => setBrands(data)) 
        .catch((err) => console.error('브랜드 목록 불러오기 실패:', err));
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>브랜드 선택</Text>
          
          {/* 브랜드 목록 표시 */}
          <FlatList
            data={brands} // ✅ 받아온 브랜드 목록
            keyExtractor={(item) => item} // ✅ 브랜드 이름이 키
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => onSelectBrand(item)}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: 'white' }}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: '#6200EE',
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
});

export default BrandFilterModal;
