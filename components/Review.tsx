import { Text, View } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import React from "react";

const Review = () => {
    return (
        <View style={GlobalStyles.infoContainer}>
            <Text style={GlobalStyles.text}>리뷰</Text>
            <Text style={GlobalStyles.icon}>⭐ ⭐ ⭐ ⭐ ⭐</Text>

        </View>
    );
};

export default Review;