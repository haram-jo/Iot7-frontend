// 리액트 관련 기본 모듈
import React from 'react';
import MainStack from './navigation/MainStack';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native'; 

const App = () => {
  return (
    <NavigationContainer> {/* ✅ 내비게이션 컨테이너로 감싸기 */}
      <MainStack />
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;
