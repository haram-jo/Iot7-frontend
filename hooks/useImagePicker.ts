import * as ImagePicker from 'expo-image-picker';
import {uploadToCloudinary} from '../utils/cloudinary';
import {analyzeReceiptOCR, extractReceiptInfo} from '../utils/ocr';
import {Alert} from 'react-native';

export const useImagePicker = (
  brandName: string,
  menuName: string,
  setLoading: (val: boolean) => void,
  setImageUrls: (fn: (prev: string[]) => string[]) => void,
  setVerified: (val: boolean) => void,
) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      setLoading(true);

      try {
        const ocrTexts = await analyzeReceiptOCR(localUri);

        const containsStore = ocrTexts.some(text => text.includes(brandName));
        const containsMenu = ocrTexts.some(text => text.includes(menuName));

        if (!containsStore || !containsMenu) {
          Alert.alert(
            '❌ 인증 실패',
            '영수증에 매장명과 메뉴명이 모두 포함되어 있어야 합니다.',
          );
          return;
        }

        const info = extractReceiptInfo(ocrTexts, brandName);
        if (info) {
          console.log('✅ 매장:', info.storeName);
          console.log('🛒 상품 목록:', info.products);
          setVerified(true);
        }

        const cloudinaryUrl = await uploadToCloudinary(localUri);
        setImageUrls(prev => [...prev, cloudinaryUrl]);
      } catch (err) {
        console.error('OCR/업로드 중 오류:', err);
        Alert.alert('이미지 처리 실패');
      } finally {
        setLoading(false);
      }
    }
  };

  return {pickImage};
};
