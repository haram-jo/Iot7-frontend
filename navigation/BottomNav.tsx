import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from '../screens/CalendarScreen';
import MyPageScreen from '../screens/MyPageScreen';
import HomeScreen from '../screens/HomeScreen';

// ✅ 탭 네비게이터 생성 (제네릭 타입 생략: 오류 방지용)
const Tab = createBottomTabNavigator();

// Icon 컴포넌트 밖으로 분리
const homeIcon = ({color}: {color: string}) => (
  <Icon name="home" size={24} color={color} />
);

const BottomTabNavigator = (): JSX.Element => {
  return (
    <Tab.Navigator
      id={undefined}
      // id="BottomTab" // ✅ 타입스크립트 오류 방지용 id
      initialRouteName="Main" // ✅ 앱 처음 실행 시 열릴 탭 이름
      screenOptions={{headerShown: false}} // ✅ 각 탭 상단의 헤더(제목줄)
    >
      {/* 📅 캘린더 탭 */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: homeIcon,
          tabBarLabel: '캘린더',
        }}
      />
      {/* 🏠 메인 탭 */}
      <Tab.Screen
        name="Main" // ✅ 탭 이름 (탭 전환 시 사용하는 key)
        component={HomeScreen} // ✅ 이 탭을 누르면 보여줄 화면 컴포넌트
        options={{
          tabBarIcon: homeIcon,
          tabBarLabel: 'Main', // ✅ 하단 탭에 보이는 글자, 추가 안할 시 name이랑 동일하게 뚬뚬
        }}
      />

      {/* 👤 마이페이지 탭 */}
      <Tab.Screen
        name="Mypage"
        component={MyPageScreen}
        options={{
          tabBarIcon: homeIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
