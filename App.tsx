// 리액트 관련 기본 모듈
import React from 'react';
import MainStack from './navigation/MainStack';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainStack />
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;
