import React from "react";
import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";

const Record: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.body}>
        <ActivityIndicator size="large" color="#585858ff" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,  
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  }
});

export default Record;