import React from "react";
import {
  Stack,
  Redirect,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/authContext";
import { View, ActivityIndicator } from "react-native";
import { ThemeProvider } from "@/context/themeContext";

const RootLayout = () => {
  const { accessToken, isLoading } = useAuth();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // Prevent navigation from happening before we check auth state
  // if (!navigationState?.key || isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color={Colors.light.primary} />
  //     </View>
  //   );
  // }

  // // Check if we're in an auth group
  // const isAuthGroup = segments[0] === 'auth';

  // if (!accessToken && !isAuthGroup) {
  //   // Redirect to the login page if we're not in the auth group
  //   return <Redirect href="/auth/login" />;
  // }

  // if (accessToken && isAuthGroup) {
  //   // Redirect to home if we're logged in and trying to access auth pages
  //   return <Redirect href="/(app)/(tabs)" />;
  // }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="hotel-details/[id]" />
        <Stack.Screen
          name="checkout/[id]"
          options={{
            headerShown: true,
            headerTitle: "Checkout",
            headerBackTitle: "Back",
            headerTintColor: Colors.light.primary,
            headerStyle: {
              backgroundColor: "white",
            },
            headerShadowVisible: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
