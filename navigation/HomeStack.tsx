// navigation/HomeStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import BrandMenuListScreen from '../screens/BrandMenuListScreen';

{
  /* 하단탭 계속 유지하기 위해 새로 만든 파일 */
  /*하단탭 유지하고 싶은 페이지 추가할때마다 밑에 넣어주면됨 */
}
const Stack = createNativeStackNavigator();

//첫번째 코드가 HomeScreen이라 첫화면도 *HomeScreen*
//순서대로 맨 위에 있는 코드가 첫화면에 보여짐
const HomeStack = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductDetailScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="BrandMenuList" component={BrandMenuListScreen} />

      {/* 여기에 위에 같은 형식으로 추가하면됨*/}
    </Stack.Navigator>
  );
};

export default HomeStack;
