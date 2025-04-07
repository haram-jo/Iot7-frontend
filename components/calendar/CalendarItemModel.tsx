import React from 'react';
import {View, Modal, Text, Image, TouchableWithoutFeedback} from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';

{
  /* 캘린더 제품 클릭 모델 */
}
const CalendarItemModel = ({visible, onClose, item}) => {
  if (!item) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={GlobalStyles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={GlobalStyles.modalContent}>
              <Text style={GlobalStyles.modalTitle}>
                메뉴 이름 : {item.title}
              </Text>
              <Image
                source={{uri: 'https://via.placeholder.com/100'}}
                style={GlobalStyles.imageBox}
              />
              <Text style={GlobalStyles.modalText}>브랜드 : {item.brand} </Text>
              <Text style={GlobalStyles.modalText}>가격 : {item.price}</Text>
              <Text style={GlobalStyles.titleText}>설명{item.description}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CalendarItemModel;
