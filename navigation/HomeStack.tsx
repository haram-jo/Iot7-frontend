// navigation/HomeStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchResultScreen from '../screens/SearchResultScreen';

{
  /* 하단탭 계속 유지하기 위해 새로 만든 파일 */
  /*하단탭 유지하고 싶은 페이지 추가할때마다 밑에 넣어주면됨 */
}
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductDetailScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      {/* 여기에 위에 같은 형식으로 추가하면됨*/}
    </Stack.Navigator>
  );
};

export default HomeStack;
