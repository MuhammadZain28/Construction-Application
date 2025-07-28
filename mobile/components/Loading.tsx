import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
const Loading: React.FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#676767ff" />
        </View>
    );
};

export default Loading;
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dbdbdb7e',
        justifyContent: "center",
        alignItems: "center"
    }
});
