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
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  BottomNav: undefined;
  Product: {item: any};
  SearchResult: {results: any};
  // 캘린더 수정중
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
