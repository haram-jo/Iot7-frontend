import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';

interface Props {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfb4meubq/image/upload';
const UPLOAD_PRESET = 'menu_image';

const MAX_IMAGES = 5;

const ReviewImageUploader = ({imageUrls, setImageUrls}: Props) => {
  const uploadToCloudinary = async (uri: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'review.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', 'dfb4meubq');

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      Alert.alert('업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      return null;
    }
  };

  const handlePickImage = async () => {
    if (imageUrls.length >= MAX_IMAGES) {
      Alert.alert('최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const cloudinaryUrl = await uploadToCloudinary(result.assets[0].uri);
      if (cloudinaryUrl) {
        setImageUrls([...imageUrls, cloudinaryUrl]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...imageUrls];
    newImages.splice(index, 1);
    setImageUrls(newImages);
  };

  return (
    <View style={styles.container}>
      {imageUrls.map((uri, idx) => (
        <TouchableOpacity
          key={idx}
          onLongPress={() => handleRemoveImage(idx)}
          style={styles.imageBox}>
          <Image source={{uri}} style={styles.image} />
        </TouchableOpacity>
      ))}
      {imageUrls.length < MAX_IMAGES && (
        <TouchableOpacity onPress={handlePickImage} style={styles.addBox}>
          <Ionicons name="add" size={32} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 10, flexWrap: 'wrap'},
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReviewImageUploader;
