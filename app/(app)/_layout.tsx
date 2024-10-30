import React from "react";
import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { Colors } from "@/constants/Colors";

const _layout = () => {
  // const isAuthenticated = false

  // if (!isAuthenticated) {
  //   return <Redirect href="/auth/welcome" />
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
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

      {/* <Stack.Screen
        name="booking-confirmation"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      /> */}
    </Stack>
  );
};

export default _layout;
