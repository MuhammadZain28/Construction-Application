import React from "react";
import { ActivityIndicator, View, StyleSheet, ImageBackground } from "react-native";
const Loading: React.FC = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground source={require('../assets/images/splash-icon.png')} resizeMode="contain" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#676767ff" />
                </View>
            </ImageBackground>
        </View>
    );
};

export default Loading;
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    }
});
