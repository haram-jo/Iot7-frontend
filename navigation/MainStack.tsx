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
import BrandMenuListScreen from '../screens/BrandMenuListScreen';
import ReviewWriteScreen from '../screens/ReviewWriteScreen';
import ReviewListScreen from '../screens/ReviewListScreen';
import MyReviewListScreen from '../screens/MyReviewListScreen';
import SubscribedBrandListScreen from '../screens/SubscribedBrandListScreen';
import EditProfile from '../screens/EditProfile';
import MyPage from '../screens/MyPageScreen';
/*이름(name)과 컴포넌트(component)를 연결해서 
/*앱에서 화면 간 이동이 가능하게 만들어주는 파일 */
/* Login = LoginSceen 이라 등록해놓으면 navigate할때 Login이라고만 명시해도됨! */

/*RootStackParamList
/*앱 안에 있는 각 화면들이 어떤 데이터를 받아야 하는지 정의한 목록*/
/*타입스크립트가 자동으로 에러를 잡아줌*/

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  BottomNav: undefined;
  Product: {menuId: number}; //Product page는 숫자를 받아야한다고 명시
  BrandMenuList: {brandName: string; businessId: number}; //brandmenuList page는 string받겠다 명시
  SearchResult: {results: any[]};
  MyReviewList: undefined;
  Home: undefined;
  SubscribedBrandList: undefined;
  Main: undefined;
  EditProfile: undefined;
  MyPage: {refresh?: boolean};

  //SearchResult: {results: any};
  ReviewWrite: {
    menuId: number;
    menuName: string;
    imageUrl: string;
    brandName: string;
  };
  ReviewList: {
    menuId: number;
    menuName: string;
    imageUrl: string;
    brandName: string;
  };

  //캘린더 수정중
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="BottomNav"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Product" component={ProductDetailScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />
        <Stack.Screen name="BrandMenuList" component={BrandMenuListScreen} />
        <Stack.Screen name="ReviewWrite" component={ReviewWriteScreen} />
        <Stack.Screen name="ReviewList" component={ReviewListScreen} />
        <Stack.Screen
          name="MyReviewList"
          component={MyReviewListScreen}
          options={{title: '내 리뷰'}}
        />
        <Stack.Screen
          name="SubscribedBrandList"
          component={SubscribedBrandListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{title: '프로필 수정'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) as any;
};

export default MainStack;
