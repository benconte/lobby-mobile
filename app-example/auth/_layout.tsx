import { Stack } from "expo-router";
import { COLORS } from "@/styles/theme";

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          contentStyle: { backgroundColor: COLORS.ScreenBG },
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          contentStyle: { backgroundColor: COLORS.ScreenBG },
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          contentStyle: { backgroundColor: COLORS.ScreenBG },
        }}
      />
    </Stack>
  );
}
