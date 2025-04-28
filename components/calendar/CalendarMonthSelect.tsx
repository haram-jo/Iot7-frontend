import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  InteractionManager,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import GlobalStyles from '../../styles/GlobalStyles';

{
  /* 월 선택을 위한 모달 */
}
// visible: 모달을 보여줄지 여부 (true면 표시됨)
// onClose: 모달을 닫을 때 실행할 함수
// selectYear(year): 연도 클릭 시 부모 컴포넌트에서 호출될 함수
// selectMonth(month): 월 클릭 시 부모 컴포넌트에서 호출될 함수
// selectedYear / selectedMonth: 현재 선택된 연도와 월
const CalendarMonthSelect = ({
  visible,
  onClose,
  selectYear,
  selectMonth,
  selectedYear,
  selectedMonth,
}) => {
  const yearListRef = useRef(null);
  const monthListRef = useRef(null);
  // 연도 & 월 리스트 생성 및 보여줄 값계산산
  const allYear = Array.from({length: 55}, (_, i) => 1990 + i);
  const allMonth = Array.from({length: 12}, (_, i) => i + 1);

  // 뒤로가기 버튼
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          onClose(); //뒤로 가기누르면 닫힘
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [visible]);

  // 연도 리스트 스크롤 (추가가)
  useEffect(() => {
    if (visible && yearListRef.current && allYear.length > 0) {
      const index = allYear.indexOf(selectedYear);
      if (index >= 0) {
        InteractionManager.runAfterInteractions(() => {
          const adjustedIndex = Math.max(0, index - 3);
          yearListRef.current.scrollToIndex({
            index: adjustedIndex,
            animated: false,
          });
        });
      }
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[GlobalStyles.modalContainer, {flex: 1}]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[GlobalStyles.pickerBox, {height: '60%'}]}>
              {/* 연도 선택 리스트 */}
              <FlatList
                ref={yearListRef}
                data={allYear} //리스트에 표시할 모든 연도 배열해해
                getItemLayout={(_, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
                // initialScrollIndex={allYear.indexOf(selectedYear)}
                showsVerticalScrollIndicator={false}
                renderItem={({item: year}) => (
                  <TouchableOpacity onPress={() => selectYear(year)}>
                    <Text
                      style={[
                        GlobalStyles.monthModalTitle,
                        year === selectedYear && {
                          color: '#4A0072',
                          fontWeight: 'bold',
                        },
                      ]}>
                      {year}년
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={year => `y-${year}`}
              />
              {/* 월 선택 리스트  */}
              <FlatList
                data={allMonth}
                showsVerticalScrollIndicator={false}
                renderItem={({item: month}) => (
                  <TouchableOpacity
                    onPress={() => {
                      selectMonth(month);
                      onClose();
                    }}>
                    <Text
                      style={[
                        GlobalStyles.monthModalTitle,
                        month === selectedMonth && {
                          color: '#4A0072',
                          fontWeight: 'bold',
                        },
                      ]}>
                      {month}월
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={month => `m-${month}`}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CalendarMonthSelect;
