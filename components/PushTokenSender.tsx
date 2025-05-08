import {useEffect, useContext} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import {AuthContext} from '../contexts/AuthContext';
import {API_URL} from '@env';

/* UI 없이 앱 시작 시 자동 실행되는 컴포넌트,
사용자 로그인 상태일 때 푸시 토큰을 발급받아서 서버로 전송하는 역할 */

const PushTokenSender = () => {
  const {user} = useContext(AuthContext); // ✅ 현재 로그인된 사용자 정보 가져오기

  useEffect(() => {
    // ✅ 푸시 토큰 발급 및 서버 전송 함수
    const registerAndSendToken = async () => {
      if (!user) return;

      try {
        if (Device.isDevice) {
          // 푸시 알림 권한 요청
          const {status: existingStatus} =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus !== 'granted') {
            console.log('❌ 푸시 권한 거부됨');
            return;
          }

          // ✅ Expo 푸시 토큰 발급
          // ✅ Expo 푸시 토큰 발급
          const token = (
            await Notifications.getExpoPushTokenAsync({
              projectId: 'c5da13a1-2edd-442d-8a64-f63cc8521182', // ← app.json의 값과 완전 일치!
            })
          ).data;
          console.log('📱 내 Expo 토큰:', token);

          // ✅ 백엔드에 토큰 전송
          await axios.post(`${API_URL}/api/push-token`, {
            userId: user.userId,
            pushToken: token,
          });

          console.log('✅ 푸시 토큰 서버 전송 완료');
        } else {
          console.log('❌ 에뮬레이터는 푸시 지원 안 함');
        }
      } catch (err) {
        console.error('🔥 푸시 토큰 전송 실패:', err);
      }
    };

    registerAndSendToken();
  }, [user]);

  return null; // 이 컴포넌트는 화면에 아무것도 렌더링하지 않음
};

export default PushTokenSender;
