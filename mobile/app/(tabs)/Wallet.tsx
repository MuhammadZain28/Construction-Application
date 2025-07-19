import React from 'react';
import { View, ScrollView, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Wallet() {
  return (
    <ScrollView>
        <View style={styles.main}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f5d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.5, 1]}
              style ={styles.card}>
                <View style={styles.container}>
                  <View style={[styles.circle, styles.circle1]} />
                  <View style={[styles.circle, styles.circle2]} />
                </View>
            </LinearGradient>
        </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    maxWidth: 450,
    width: '100%',
    height: 225,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
  },
  circle1: {
    backgroundColor: 'rgba(255, 0, 0, 1)', // red with transparency
    left: 100,
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  circle2: {
    backgroundColor: 'rgba(255, 170, 0, 1)', // blue with transparency
    left: 170,
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    mixBlendMode: 'lighten', // blend mode for overlapping effect
  },
})