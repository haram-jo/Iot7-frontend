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
        if (!Device.isDevice) {
          console.log('❌ 에뮬레이터는 푸시 미지원');
          return;
        }

        // ✅ 1. 서버에 저장된 기존 토큰 확인
        const res = await axios.get(`${API_URL}/api/push-token`, {
          params: {userId: user.userId},
        });
        const {token: savedToken, notificationYn} = res.data;

        if (notificationYn === 'N') {
          console.log('🔕 사용자가 알림을 꺼둠 – 토큰 발급 생략');
          return;
        }

        if (savedToken) {
          console.log('✅ 기존 토큰 존재 – 발급 생략');
          return;
        }

        // ✅ 3. 푸시 권한 요청
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

        // ✅ 4. 새로 발급
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: 'c5da13a1-2edd-442d-8a64-f63cc8521182',
          })
        ).data;

        console.log('📱 새로 발급된 토큰:', token);

        // ✅ 5. 서버에 전송
        await axios.post(`${API_URL}/api/push-token`, {
          userId: user.userId,
          pushToken: token,
        });

        console.log('✅ 푸시 토큰 서버 저장 완료');
      } catch (err) {
        console.error('🔥 푸시 토큰 처리 실패:', err);
      }
    };

    registerAndSendToken();
  }, [user]);

  return null;
};

export default PushTokenSender;
