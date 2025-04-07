import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const Banner = () => {
  return (
    <View
      style={{
        width: width * 0.9,
        height: width * 0.4,
        alignSelf: 'center',
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: width * 0.05, fontWeight: 'bold'}}>
        메인 배너
      </Text>
    </View>
  );
};

export default Banner;
