import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DataProvider } from './DataContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <DataProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            height: Platform.OS === 'android' ? 70 : 60,
          },
        }}>
          
        <Tabs.Screen
          name="Dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'House',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Home"
          options={{
            title: 'Material',
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="construction" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Paints',
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="format-paint" color={color} />,
          }}
        />
      <Tabs.Screen
        name="Wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="wallet" color={color} />,
        }}
      />
      </Tabs>
      </SafeAreaView>
    </DataProvider>
  );
}
