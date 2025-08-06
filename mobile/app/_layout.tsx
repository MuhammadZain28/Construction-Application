import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { DataProvider, useDataContext } from './(tabs)/DataContext';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';



function LayoutContent() {
  const { isDataLoaded } = useDataContext();
  const colorScheme = useColorScheme();
  const onLayoutRootView = useCallback(async () => {
    if (isDataLoaded) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    }
  }, [isDataLoaded]);
  const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
      });

  if (!isDataLoaded || !loaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}


export default function RootLayout() {

  return (
    <DataProvider>
      <LayoutContent />
    </DataProvider>
  );
}
