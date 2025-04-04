# 📱 New Menu App - Expo 프로젝트 실행 가이드

이 프로젝트는 **Expo 기반의 React Native 앱**입니다.  
로컬 환경에서 앱을 실행하기 위한 가이드를 아래 순서대로 따라주세요.

---
## ✅ 0. 환경 설정정
.env파일 생성
#개인 IP주소로 변경 (터미널에서 "ipconfig"로 확인)
API_URL=http://"개인 IP주소":8080

## ✅ 1. 의존성 설치

먼저 프로젝트 디렉토리로 이동한 뒤 필요한 패키지를 설치합니다.

```bash
npm install
```
---

## 📱 2. Expo CLI 설치 (처음 한 번만)

Expo CLI가 없다면 전역으로 설치해 주세요.

```bash
npm install -g expo-cli
```
---

## 🚀 3. 앱 실행 (로컬 or 에뮬레이터)
```bash
npx expo start
```

### 3-1. 웹, 안드로이드, iOS 중 원하는 플랫폼 실행

- 터미널에 QR코드가 뜨면 Expo Go 앱으로 스캔하면 됩니다.
- 또는 아래 키로 실행:
  - `w`: 웹
  - `a`: 안드로이드 에뮬레이터
  - `i`: iOS 시뮬레이터 (macOS에서만 가능)

---

## 📱 4. 안드로이드 에뮬레이터로 실행하려면

Expo는 **안드로이드 스튜디오로 만든 에뮬레이터도 인식해서 실행할 수 있습니다.**

### 4-1. 가상 디바이스 확인

```bash
emulator -list-avds
```

아래처럼 리스트가 나오면 OK:

```
Pixel_9_Pro
Small_Phone_API_34
```

### 4-2. 에뮬레이터 실행

```bash
emulator -avd Pixel_9_Pro
```

> 이름은 위에서 확인한 가상 디바이스 명으로 입력하세요.

### 4-3. 에뮬레이터 인식 확인

```bash
adb devices
```

정상적으로 아래처럼 나와야 합니다:

```
List of devices attached
emulator-5554   device
```

### 4-4. 에뮬레이터가 안 뜰 경우

```bash
adb kill-server
adb start-server
```

### 4-5. Expo에서 에뮬레이터 자동 실행하려면?

에뮬레이터가 켜진 상태에서 다음 명령어를 입력하세요:

```bash
npx expo start --android
```

Expo가 자동으로 실행 중인 가상 디바이스에 앱을 설치하고 실행해줍니다.

---

## 📦 5. 앱 실행 확인

```bash
npx expo start
```

에뮬레이터가 켜져 있으면 자동으로 앱이 빌드되어 실행됩니다.

---

## 📚 참고

- 가상 디바이스 설정 방법 참고:  
  [안드로이드 에뮬레이터 설정 가이드](https://chococookiee.tistory.com/50)
- Expo 공식 문서: https://docs.expo.dev/

---

## 🛠️ 기술 스택

- React Native (Expo)
- JavaScript / TypeScript (선택사항)
- Android Emulator or Expo Go

---

