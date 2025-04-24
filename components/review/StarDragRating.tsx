import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StarTapRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  const STAR_COUNT = 5;

  const handlePress = (index: number, isHalf: boolean) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
  };

  const renderStar = (index: number) => {
    const full = index + 1 <= rating;
    const half = index + 0.5 === rating;

    let iconName = 'star-o';
    if (full) iconName = 'star';
    else if (half) iconName = 'star-half-full';

    return (
      <View key={index} style={styles.starWrapper}>
        {/* 터치 영역 구분: 왼쪽(0.5점), 오른쪽(1점) */}
        <TouchableOpacity
          style={styles.leftTouchArea}
          onPress={() => handlePress(index, true)}
          activeOpacity={0.6}
        />
        <TouchableOpacity
          style={styles.rightTouchArea}
          onPress={() => handlePress(index, false)}
          activeOpacity={0.6}
        />
        <Icon name={iconName} size={48} color="#FFD700" style={styles.star} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(index => renderStar(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  starWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
    marginHorizontal: 6,
  },
  star: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    width: '50%',
    height: '100%',
    zIndex: 1,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    width: '50%',
    height: '100%',
    zIndex: 1,
  },
});

export default StarTapRating;
