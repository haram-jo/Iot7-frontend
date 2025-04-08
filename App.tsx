// 리액트 관련 기본 모듈
import React from 'react';
import MainStack from './navigation/MainStack';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './contexts/AuthContext';

//✅앱이 시작될 때 어떤 화면을 보여줄지 정하는 파일

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
