import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 내 정보가 궁금한가요?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default MyPage;
