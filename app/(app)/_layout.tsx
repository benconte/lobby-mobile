import React, { useEffect } from "react";
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
  const { accessToken, isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!isLoading) {
      console.log('Auth state:', { 
        accessToken, 
        isAuthenticated, 
        currentSegment: segments[0] 
      });
    }
  }, [isLoading, accessToken, isAuthenticated, segments]);

  // Show loading screen while checking auth state and navigation is initializing
  if (!navigationState?.key || isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.light.background 
      }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Get the current segment to determine if we're in an auth group
  const isAuthGroup = segments[0] === 'auth';

  // Authentication flow logic
  if (!isAuthenticated && !isAuthGroup) {
    console.log('Not authenticated, redirecting to login');
    return <Redirect href="/auth/login" />;
  }

  if (isAuthenticated && isAuthGroup) {
    console.log('Already authenticated, redirecting to home');
    return <Redirect href="/(app)/(tabs)/" />;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.light.background },
        }}
      >
        {/* Protected Routes */}
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
          }}
        />

        {/* Auth Routes */}
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
            // Prevent going back to auth screens when logged in
            gestureEnabled: !isAuthenticated 
          }} 
        />

        {/* Other Routes */}
        <Stack.Screen 
          name="hotel-details/[id]"
          options={{
            headerShown: true,
            headerTitle: "Hotel Details",
            headerBackTitle: "Back",
            headerTintColor: Colors.light.primary,
            headerStyle: {
              backgroundColor: "white",
            },
            headerShadowVisible: false,
          }}
        />
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
          }}
        />

        {/* Error Screen */}
        <Stack.Screen 
          name="[...missing]" 
          options={{ 
            title: 'Not Found',
            headerShown: true 
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
