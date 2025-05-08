// metro.config.js (Expo용 기본 설정 수정)
const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

// 1) '.cjs' 확장자를 번들러가 인식하도록 추가
defaultConfig.resolver.sourceExts.push('cjs', 'env');

// 2) (Expo SDK 53+인 경우) 패키지 exports 기능 비활성화
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;