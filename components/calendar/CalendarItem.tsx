import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import categoryColors from '../../styles/categoryColors';

// 캘린더 페이지에서 쓰일 제품들의 카테고리데 따른 색상과 이름을 표시하는 컴포넌트
const CalendarItem = ({item, menu, style, ...touchableOpacityProps}) => {
  ////// 카테고리 색상 처리 (카테고리에 따른 색상 지정 로직)
  const category = categoryColors[menu.category] || categoryColors['기본'];

  return (
    // 캘린더에 보일 박스 UI
    <TouchableOpacity
      {...touchableOpacityProps}
      style={GlobalStyles.modalTitle}>
      <Text
        // 이벤트 텍스트 너무 길면 자름 (ellipsizeMode까지지)
        numberOfLines={1}
        ellipsizeMode="tail">
        {item.menuName || item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default CalendarItem;
