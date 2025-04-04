import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import GlobalStyles from '../styles/GlobalStyles';
import Review from '../components/Review';

const ProductDetailScreen = () => {
    return (
        <ScrollView style={GlobalStyles.container}>
            <Review/>
            <View>
                <Text> 상품 상세정보</Text>
            </View>
        </ScrollView>

    );

};
export default ProductDetailScreen;
