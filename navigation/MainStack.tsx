import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNav from './BottomNav';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import CalendarScreen from '../screens/CalendarScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import HomeScreen from '../screens/HomeScreen';

/*이름(name)과 컴포넌트(component)를 연결해서 
/*앱에서 화면 간 이동이 가능하게 만들어주는 파일 */
/* Login = LoginSceen 이라 등록해놓으면 navigate할때 Login이라고만 명시해도됨! */

//✅ RootStackParamList
//앱 안에 있는 각 화면들이 어떤 데이터를 받아야 하는지 정의한 목록
//타입스크립트가 자동으로 에러를 잡아줌

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  BottomNav: undefined;
  Product: {menuId: number}; //Product page는 숫자를 받아야한다고 명시
  //SearchResult: {results: any};
  //캘린더 수정중
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <NavigationContainer>
      {/* 캘린더 수정중 */}
      {/* <Stack.Navigator id={undefined} initialRouteName="Calendar" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Calendar" component={CalendarScreen} /> */}

      <Stack.Navigator
        id={undefined}
        initialRouteName="BottomNav"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="Product" component={ProductDetailScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
