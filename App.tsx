import React, {useEffect} from 'react';
import MainStack from './navigation/MainStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './contexts/AuthContext';
import {SafeAreaView} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import PushTokenSender from './components/PushTokenSender';
import * as Notifications from 'expo-notifications';

// ✅ 푸시 알림 핸들러 설정 - 앱이 실행 중일 때 어떻게 알림을 표시할지 정의
// ✅ 최근 SDK에서 구조가 바뀌면서, native notification 처리와 충돌이 날 수도 있음
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // ✅ 배너만 표시
    shouldShowList: false, // ❌ 알림 센터에 저장하지 않음
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowInForeground: true, // ✅ 앱 켜져 있어도 뜨게 함
  }),
});

const App = () => {
  // ✅ 여기에서 알림 채널 등록 (Android용)
  useEffect(() => {
    Notifications.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications.AndroidImportance.HIGH, //중요도 높게
      sound: 'default',
    });
  }, []);
  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={{flex: 1}}>
        <AuthProvider>
          <PushTokenSender />
          <MainStack />
        </AuthProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
};

export default App;
