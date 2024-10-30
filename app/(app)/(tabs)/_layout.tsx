import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const _layout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: Colors.light.icon,
          tabBarStyle: {
            backgroundColor: Colors.light.background,
            borderTopColor: Colors.light.border,
            borderTopWidth: 1,
            height: 76,
            paddingBottom: 15,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 10,
          },
          // Correct way to handle safe area
          tabBarItemStyle: {
            paddingBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wishlists"
          options={{
            title: 'Wishlists',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: 'Trips',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="airplane-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default _layout;